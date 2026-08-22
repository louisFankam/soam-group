"""Helpers partagés pour les tests front SOAM GROUP.

Lance `next start` sur un port de test si nécessaire et fournit
un navigateur Playwright headless avec capture des erreurs JS.
"""

import contextlib
import os
import signal
import socket
import subprocess
import time
import urllib.request

PORT = 3123
BASE = f"http://localhost:{PORT}"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

_server_proc = None


def _port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("localhost", port)) == 0


def start_server() -> None:
    """Démarre le serveur de prod Next.js. Rebuild sauf si SKIP_BUILD=1."""
    global _server_proc
    if _port_open(PORT):
        return  # serveur déjà lancé (ex: lancé par l'appelant)
    if os.environ.get("SKIP_BUILD") != "1":
        subprocess.run(["npm", "run", "build"], cwd=ROOT, check=True,
                       stdout=subprocess.DEVNULL)
    _server_proc = subprocess.Popen(
        ["npx", "next", "start", "-p", str(PORT)],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True,
    )
    deadline = time.time() + 60
    while time.time() < deadline:
        if _port_open(PORT):
            break
        if _server_proc.poll() is not None:
            raise RuntimeError("Le serveur Next.js n'a pas démarré")
        time.sleep(0.5)
    else:
        raise RuntimeError("Timeout en attendant le serveur")
    # première requête = compilation/échauffement
    urllib.request.urlopen(BASE, timeout=30).read()


def stop_server() -> None:
    global _server_proc
    if _server_proc is not None:
        with contextlib.suppress(ProcessLookupError):
            os.killpg(_server_proc.pid, signal.SIGTERM)
        _server_proc = None


class Page:
    """Page Playwright + capture des erreurs JS (pageerror uniquement ;
    les échecs réseau d'images externes ne font pas échouer les tests)."""

    def __init__(self, pw, viewport=None):
        self.browser = pw.chromium.launch(headless=True)
        self.page = self.browser.new_page(viewport=viewport or {"width": 1440, "height": 900})
        self.js_errors: list[str] = []
        self.page.on("pageerror", lambda e: self.js_errors.append(str(e)))

    def goto(self, url: str = BASE) -> None:
        self.page.goto(url)
        self.page.wait_for_load_state("networkidle")

    def assert_no_js_errors(self) -> None:
        assert not self.js_errors, f"Erreurs JS: {self.js_errors}"

    def close(self) -> None:
        self.browser.close()

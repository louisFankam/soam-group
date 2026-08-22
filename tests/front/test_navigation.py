"""Crawl anti-lien-mort : chaque lien interne du site doit répondre 200."""

import re
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlparse

from helpers import BASE

DOMAINE_PROD = "https://www.soamgroup.net"
PAGES_DE_PART = [
    "/", "/logiciels", "/realisations", "/expertises",
    "/solutions", "/actualites", "/a-propos", "/contact",
]

HREF_RE = re.compile(r'href="([^"]+)"')
SKIP_SUFFIXES = (".jpeg", ".jpg", ".png", ".mp4", ".svg", ".ico", ".webmanifest")


def _liens_internes(html: str) -> list[str]:
    out = set()
    for href in HREF_RE.findall(html):
        if href.startswith(("#", "mailto:", "tel:")):
            continue
        url = urljoin(BASE, href)
        p = urlparse(url)
        if p.netloc not in ("localhost", urlparse(BASE).netloc):
            continue
        chemin = p.path or "/"
        if any(chemin.endswith(s) for s in SKIP_SUFFIXES) or chemin.startswith("/_next"):
            continue
        out.add(chemin)
    return sorted(out)


def _sitemap_paths() -> set[str]:
    with urllib.request.urlopen(f"{BASE}/sitemap.xml", timeout=30) as r:
        root = ET.fromstring(r.read())
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return {e.text.replace(DOMAINE_PROD, "") or "/" for e in root.findall(".//s:loc", ns)}


def _get_ok(url: str) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=30):
            return True
    except Exception:  # noqa: BLE001
        return False


def test_toutes_les_pages_du_sitemap_repondent(pw):
    chemins = _sitemap_paths()
    assert len(chemins) >= 39, f"sitemap incomplet ({len(chemins)} urls)"
    morts = [c for c in sorted(chemins) if not _get_ok(f"{BASE}{c}")]
    assert not morts, f"pages du sitemap en erreur : {morts}"


def test_pages_cle_presentes_du_sitemap(pw):
    chemins = _sitemap_paths()
    for cle in (
        "/", "/contact", "/a-propos", "/mentions-legales",
        "/politique-confidentialite", "/solutions/entreprise",
        "/logiciels/soam-school", "/expertises/cybersecurite",
        "/realisations/soc-banque-atlantique", "/actualites/lancement-soam-security-v2",
    ):
        assert cle in chemins, f"{cle} absente du sitemap"


def test_liens_rendus_coherents_avec_le_sitemap(pw):
    """Tout lien interne rendu doit être une page connue du sitemap."""
    chemins_sitemap = _sitemap_paths()
    inconnus: set[str] = set()

    for page_path in PAGES_DE_PART:
        with urllib.request.urlopen(f"{BASE}{page_path}", timeout=30) as r:
            html = r.read().decode()
        for chemin in _liens_internes(html):
            if chemin not in chemins_sitemap:
                inconnus.add(chemin)

    assert not inconnus, f"liens hors sitemap : {sorted(inconnus)}"

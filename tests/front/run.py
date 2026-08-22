"""Runner des tests front : python3 tests/front/run.py

Lance le serveur Next.js (build si nécessaire), exécute tous les
modules test_*.py du répertoire et affiche un résumé PASS/FAIL.
Exit code non nul si au moins un test échoue.
"""

import importlib.util
import inspect
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).parent))
import helpers  # noqa: E402


def load_tests(directory: Path):
    """Charge toutes les fonctions test_* de tous les modules test_*.py."""
    suites = []
    for module_path in sorted(directory.glob("test_*.py")):
        spec = importlib.util.spec_from_file_location(module_path.stem, module_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        tests = [
            (name, fn)
            for name, fn in inspect.getmembers(module, inspect.isfunction)
            if name.startswith("test_")
        ]
        suites.append((module_path.stem, tests))
    return suites


def main() -> int:
    directory = Path(__file__).parent
    helpers.start_server()
    suites = load_tests(directory)

    passed: list[str] = []
    failed: list[tuple[str, str]] = []

    with sync_playwright() as pw:
        for suite_name, tests in suites:
            print(f"\n=== {suite_name} ===")
            for name, fn in tests:
                label = f"{suite_name}::{name}"
                try:
                    fn(pw)
                    passed.append(label)
                    print(f"  PASS {name}")
                except Exception as exc:  # noqa: BLE001 — le runner rapporte tout
                    failed.append((label, f"{type(exc).__name__}: {exc}"))
                    print(f"  FAIL {name}\n       {exc}")

    helpers.stop_server()

    print(f"\n{'=' * 46}")
    print(f"Résultat : {len(passed)} réussi(s), {len(failed)} échoué(s)")
    for label, err in failed:
        print(f"  ÉCHEC {label}\n         {err}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

"""Statistiques : comptage des vues publiques + page /admin/statistiques."""

import sqlite3
import re
from pathlib import Path

from playwright.sync_api import expect

from helpers import BASE, Page, start_server

ROOT = Path(__file__).resolve().parents[2]
DB = ROOT / "soam.db"

DASH = re.compile(rf"{BASE}/admin$")


def _login(page):
    page.goto(f"{BASE}/admin/login")
    page.page.fill("#email", "admin@soamgroup.net")
    page.page.fill("#motDePasse", "admin123")
    page.page.click("button[type=submit]")
    page.page.wait_for_url(DASH, timeout=15000)


def test_vue_publique_comptee(pw):
    p = Page(pw)
    try:
        start_server()
        # Visite hors session admin -> doit être comptée
        p.goto(f"{BASE}/expertises")
        p.page.wait_for_timeout(800)

        con = sqlite3.connect(DB)
        try:
            total = con.execute(
                "SELECT COALESCE(SUM(vues), 0) FROM visites WHERE chemin = '/expertises'"
            ).fetchone()[0]
        finally:
            con.close()
        assert total >= 1, f"/expertises absente des statistiques (vues={total})"
        p.assert_no_js_errors()
    finally:
        p.close()


def test_admin_non_compte(pw):
    p = Page(pw)
    try:
        start_server()
        _login(p)
        con = sqlite3.connect(DB)
        try:
            avant = con.execute("SELECT COALESCE(SUM(vues), 0) FROM visites").fetchone()[0]
        finally:
            con.close()

        p.goto(f"{BASE}/contact")
        p.page.wait_for_timeout(800)

        con = sqlite3.connect(DB)
        try:
            apres = con.execute("SELECT COALESCE(SUM(vues), 0) FROM visites").fetchone()[0]
        finally:
            con.close()
        assert apres == avant, f"la visite de l'admin a été comptée ({avant} -> {apres})"
    finally:
        p.close()


def test_page_statistiques_rendu(pw):
    p = Page(pw)
    try:
        start_server()
        _login(p)
        p.goto(f"{BASE}/admin/statistiques")

        contenu = p.page.locator("main").inner_text() if p.page.locator("main").count() else p.page.content()
        for attendu in ("Aujourd'hui", "30 derniers jours", "Pages les plus visitées"):
            assert attendu in contenu, f"« {attendu} » absent de la page statistiques"
        # la carte du tableau de bord est branchée
        p.goto(f"{BASE}/admin")
        expect(p.page.get_by_text("branchement à venir")).to_have_count(0)
        p.assert_no_js_errors()
    finally:
        p.close()

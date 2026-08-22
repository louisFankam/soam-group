"""Sécurité : blocage du login admin après 5 échecs (anti brute-force)."""

import re
import sqlite3
from pathlib import Path

from helpers import BASE, Page, start_server

ROOT = Path(__file__).resolve().parents[2]


def _soumettre(page, email, mdp):
    page.goto(f"{BASE}/admin/login")
    page.fill("#email", email)
    page.fill("#motDePasse", mdp)
    page.click("button[type=submit]")
    page.wait_for_load_state("networkidle")


def test_blocage_apres_5_echecs(pw):
    p = Page(pw)
    try:
        start_server()
        for _ in range(5):
            _soumettre(p.page, "admin@soamgroup.net", "mauvais-mdp")

        # au 6e essai (même avec le bon mot de passe) -> bloqué
        _soumettre(p.page, "admin@soamgroup.net", "admin123")
        assert "erreur=2" in p.page.url, f"blocage attendu, url={p.page.url}"
        assert "Trop de tentatives" in p.page.content()

        # un autre email n'hérite pas du blocage
        _soumettre(p.page, "autre@exemple.net", "peu-importe")
        assert "erreur=2" not in p.page.url, "blocage trop large (autre email touché)"
    finally:
        con = sqlite3.connect(ROOT / "soam.db")
        try:
            con.execute("DELETE FROM tentatives_connexion")
            con.commit()
        finally:
            con.close()
        p.close()

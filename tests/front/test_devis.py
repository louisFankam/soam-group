"""Devis : formulaire public en 3 étapes, honeypot, traitement admin."""

import re
import sqlite3
import time

from playwright.sync_api import expect

from helpers import BASE, Page, start_server

ROOT = __import__("pathlib").Path(__file__).resolve().parents[2]
DB = ROOT / "soam.db"

DASH = re.compile(rf"{BASE}/admin$")


def _login(page):
    page.goto(f"{BASE}/admin/login")
    page.page.fill("#email", "admin@soamgroup.net")
    page.page.fill("#motDePasse", "admin123")
    page.page.click("button[type=submit]")
    page.page.wait_for_url(DASH, timeout=15000)


def _nb_devis():
    con = sqlite3.connect(DB)
    try:
        return con.execute("SELECT count(*) FROM devis").fetchone()[0]
    finally:
        con.close()


def test_formulaire_trois_etapes(pw):
    p = Page(pw)
    try:
        start_server()
        avant = _nb_devis()
        email = f"devis-{int(time.time())}@exemple.bf"

        # Étape 1 — coordonnées
        p.goto(f"{BASE}/devis")
        p.page.fill("#nom", "Client Test Devis")
        p.page.fill("#telephone", "+226 70 00 00 00")
        p.page.fill("#email", email)
        p.page.get_by_role("button", name="Continuer").click()

        # Étape 2 — besoin
        p.page.select_option("#secteur", "Santé")
        p.page.select_option("#service", index=1)
        p.page.check("input[value='10 – 50 M GNF']")
        p.page.get_by_role("button", name="Continuer").click()

        # Étape 3 — projet
        p.page.fill(
            "#description",
            "Nous souhaitons sécuriser le réseau de notre clinique avec un audit complet.",
        )
        p.page.get_by_role("button", name="Envoyer ma demande").click()

        expect(p.page.locator("h2")).to_contain_text("bien reçue", timeout=15000)

        con = sqlite3.connect(DB)
        try:
            ligne = con.execute(
                "SELECT nom, secteur, budget, statut FROM devis WHERE email = ?", (email,)
            ).fetchone()
        finally:
            con.close()
        assert ligne, "la demande n'a pas été enregistrée"
        assert ligne[0] == "Client Test Devis"
        assert ligne[1] == "Santé"
        assert "GNF" in ligne[2]
        assert ligne[3] == "nouveau"
        assert _nb_devis() == avant + 1
    finally:
        p.close()


def test_honeypot_ignorer_bot(pw):
    p = Page(pw)
    try:
        start_server()
        avant = _nb_devis()
        rep = p.page.request.post(
            f"{BASE}/api/devis",
            form={
                "nom": "Bot",
                "telephone": "+226 00",
                "email": "bot@spam.tld",
                "secteur": "X",
                "service": "Y",
                "budget": "z",
                "description": "achetez maintenant",
                "siteWeb": "http://spam.tld",
            },
        )
        assert rep.status in (200, 303), f"statut inattendu: {rep.status}"
        time.sleep(0.5)
        assert _nb_devis() == avant, "le honeypot a laissé passer un bot"
    finally:
        p.close()


def test_traitement_admin(pw):
    p = Page(pw)
    try:
        start_server()
        ts = int(time.time())
        email = f"admin-devis-{ts}@exemple.bf"
        con = sqlite3.connect(DB)
        try:
            con.execute(
                "INSERT INTO devis (nom, telephone, email, secteur, service, budget, description, cree_le)"
                " VALUES (?, '+226 70 00 00 00', ?, 'Entreprises', 'Cybersécurité', 'À discuter', 'Test admin', ?)",
                (f"Devis {ts}", email, ts),
            )
            con.commit()
        finally:
            con.close()

        _login(p)
        p.goto(f"{BASE}/admin/devis")
        ligne = p.page.locator("article", has_text=email)
        expect(ligne).to_contain_text("NOUVEAU")

        # changer le statut -> le badge devient EN COURS
        ligne.locator("select").select_option("en_cours")
        ligne.get_by_role("button", name="Mettre à jour").click()
        p.page.reload()
        ligne = p.page.locator("article", has_text=email)
        expect(ligne).to_contain_text("EN COURS", timeout=10000)

        # filtre par statut
        p.goto(f"{BASE}/admin/devis?statut=en_cours")
        expect(p.page.locator("article", has_text=email)).to_be_visible()

        # nettoyage
        con = sqlite3.connect(DB)
        try:
            con.execute("DELETE FROM devis WHERE email = ?", (email,))
            con.commit()
        finally:
            con.close()
    finally:
        p.close()

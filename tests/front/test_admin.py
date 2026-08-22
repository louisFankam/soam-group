"""Tests du portail admin : auth, CRUD contenu, inbox messages, paramètres."""

import re
import sqlite3
import time

from playwright.sync_api import expect
from pathlib import Path

from helpers import BASE, Page, start_server

ROOT = Path(__file__).resolve().parents[2]
DB = ROOT / "soam.db"

DASH = re.compile(rf"{BASE}/admin$")
LOGIN_OK = ("admin@soamgroup.net", "admin123")

# Valeurs seedées (lib/content.ts) — restaurées après le test coordonnées.
SITE_SEED = {
    "name": "SOAM GROUP",
    "tagline": "Intégrateur technologique — Ouagadougou, Burkina Faso",
    "phone": "+226 25 XX XX XX",
    "whatsapp": "+226 70 XX XX XX",
    "email": "contact@soamgroup.net",
    "address": "Ouagadougou, Burkina Faso — Zone du Bois, Rue 12.09",
    "hours": "Lundi – Vendredi : 08h00 – 17h00",
}


def _login(page):
    page.goto(f"{BASE}/admin/login")
    page.page.fill("#email", LOGIN_OK[0])
    page.page.fill("#motDePasse", LOGIN_OK[1])
    page.page.click("button[type=submit]")
    page.page.wait_for_url(DASH, timeout=15000)


def test_garde_et_login(pw):
    start_server()
    p = Page(pw)
    try:
        # sans session -> redirection login
        p.goto(f"{BASE}/admin/actualites")
        assert "/admin/login" in p.page.url

        # mauvais mot de passe -> retour login avec erreur
        p.page.fill("#email", LOGIN_OK[0])
        p.page.fill("#motDePasse", "mauvais")
        p.page.click("button[type=submit]")
        p.page.wait_for_url("**erreur=1*", timeout=15000)
        assert "Identifiants incorrects" in p.page.inner_text("body")

        # bons identifiants -> dashboard
        p.page.fill("#motDePasse", LOGIN_OK[1])
        p.page.click("button[type=submit]")
        p.page.wait_for_url(DASH, timeout=15000)
        assert "Bienvenue" in p.page.inner_text("body")
    finally:
        p.close()


def test_crud_article(pw):
    start_server()
    p = Page(pw)
    ts = int(time.time())
    slug = f"article-e2e-{ts}"
    try:
        _login(p)

        # création via l'UI admin
        p.goto(f"{BASE}/admin/actualites/nouveau")
        p.page.fill("#champ-title", f"Article e2e {ts}")
        p.page.fill("#champ-slug", slug)
        p.page.fill("#champ-category", "E2E")
        p.page.fill("#champ-date", "21 août 2026")
        p.page.fill("#champ-excerpt", "Chapeau de test e2e.")
        p.page.fill("#champ-body", "Paragraphe un.\nParagraphe deux.")
        p.page.get_by_role("button", name="Enregistrer").click()
        p.page.wait_for_url("**/admin/actualites?ok=1", timeout=15000)

        # visible côté public
        resp = p.page.goto(f"{BASE}/actualites/{slug}")
        assert resp is not None and resp.status == 200
        p.page.locator("h1", has_text=f"Article e2e {ts}").first.wait_for(timeout=15000)

        # édition
        p.goto(f"{BASE}/admin/actualites")
        p.page.locator("li", has_text=f"Article e2e {ts}").get_by_text("Éditer").click()
        p.page.wait_for_load_state("networkidle")
        p.page.fill("#champ-title", f"Article e2e modifié {ts}")
        p.page.get_by_role("button", name="Enregistrer").click()
        p.page.wait_for_url("**?ok=1", timeout=15000)
        resp = p.page.goto(f"{BASE}/actualites/{slug}")
        assert resp is not None and resp.status == 200
        p.page.locator("h1", has_text=f"modifié {ts}").first.wait_for(timeout=15000)

        # suppression + 404 public (le cache peut servir l'ancienne page un instant)
        p.goto(f"{BASE}/admin/actualites")
        p.page.locator("li", has_text=f"Article e2e modifié {ts}").get_by_text(
            "Supprimer"
        ).click()
        p.page.wait_for_url("**ok=supprime*", timeout=15000)
        statut = None
        for _ in range(20):
            r = p.page.goto(f"{BASE}/actualites/{slug}")
            statut = r.status if r else None
            if statut == 404:
                break
            p.page.wait_for_timeout(500)
        assert statut == 404, f"article toujours visible (statut {statut})"
    finally:
        p.close()


def test_slug_duplique_rejete(pw):
    start_server()
    p = Page(pw)
    try:
        _login(p)
        p.goto(f"{BASE}/admin/actualites/nouveau")
        p.page.fill("#champ-title", f"Dupliqué {int(time.time())}")
        p.page.fill("#champ-slug", "partenariat-microsoft-2025")  # slug seedé
        p.page.fill("#champ-category", "X")
        p.page.fill("#champ-date", "21 août")
        p.page.fill("#champ-excerpt", "x")
        p.page.fill("#champ-body", "x")
        p.page.get_by_role("button", name="Enregistrer").click()
        p.page.wait_for_url("**erreur=slug*", timeout=15000)
        assert "existe déjà" in p.page.inner_text("body")
    finally:
        p.close()


def test_message_inbox(pw):
    start_server()
    p = Page(pw)
    ts = int(time.time())
    email = f"client-{ts}@test.bf"
    try:
        # envoi du formulaire de contact (côté public)
        p.goto(f"{BASE}/contact")
        p.page.fill("#nom", f"Client {ts}")
        p.page.fill("#email", email)
        p.page.select_option("#sujet", "Demande de devis")
        p.page.fill("#message", "Je veux un devis pour un réseau.")
        with p.page.expect_navigation():
            p.page.click("button[type=submit]")

        # visible dans la boîte de réception avec badge NOUVEAU
        _login(p)
        p.goto(f"{BASE}/admin/messages")
        ligne = p.page.locator("article", has_text=email)
        expect(ligne).to_contain_text(f"Client {ts}", timeout=15000)
        expect(ligne).to_contain_text("NOUVEAU")

        # marquer lu -> le badge de CE message disparaît
        ligne.get_by_role("button", name="Marquer lu").click()
        expect(ligne).not_to_contain_text("NOUVEAU", timeout=10000)

        # nettoyage via l'API de l'app (invalide les tags correctement)
        with sqlite3.connect(DB) as con:
            row = con.execute(
                "SELECT id FROM messages WHERE email = ?", (email,)
            ).fetchone()
        if row:
            p.page.request.post(
                f"{BASE}/api/admin",
                form={"__action": "message-archive", "id": str(row[0]), "archive": "1"},
            )
    finally:
        p.close()


def test_parametres(pw):
    start_server()
    p = Page(pw)
    try:
        _login(p)
        p.goto(f"{BASE}/admin/parametres")

        # coordonnées : enregistrement valide (restaure les valeurs seedées)
        for nom, valeur in SITE_SEED.items():
            p.page.fill(f"#champ-{nom}", valeur)
        p.page.click("text=Enregistrer les coordonnées")
        p.page.wait_for_url("**parametres?ok=1*", timeout=15000)

        # JSON invalide -> erreur
        p.page.locator("details summary").click()
        ta = p.page.locator('textarea[name="json"]').first
        ta.fill("{json cassé")
        p.page.locator('button:has-text("Enregistrer « hero »")').click()
        p.page.wait_for_url("**erreur=json**", timeout=15000)
        assert "JSON invalide" in p.page.inner_text("body")
    finally:
        p.close()


def test_deconnexion(pw):
    start_server()
    p = Page(pw)
    try:
        _login(p)
        p.page.click("button:has-text('Déconnexion')")
        p.page.wait_for_url("**/admin/login*", timeout=15000)
        # la session est bien morte : une page protégée renvoie au login
        p.goto(f"{BASE}/admin/messages")
        assert "/admin/login" in p.page.url
    finally:
        p.close()

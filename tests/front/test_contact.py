"""Page Contact : formulaire, préselection du sujet, confirmation d'envoi."""

from helpers import Page, BASE


def test_page_contact_structure(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/contact")
        assert "Contact" in p.page.title()
        for champ in ("nom", "email", "tel", "sujet", "message"):
            assert p.page.locator(f"#{champ}").count() == 1, champ
        # coordonnées visibles
        body = p.page.inner_text("main")
        for attendu in ("Ouagadougou", "+226", "@soamgroup"):
            assert attendu in body, f"coordonnée manquante: {attendu}"
        p.assert_no_js_errors()
    finally:
        p.close()


def test_preselection_sujet(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/contact?sujet=Demande%20de%20devis")
        valeur = p.page.locator("#sujet").input_value()
        assert valeur == "Demande de devis", f"sujet non prérempli: '{valeur}'"
    finally:
        p.close()


def test_soumission_formulaire(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/contact")
        p.page.fill("#nom", "Test Playwright")
        p.page.fill("#email", "test@example.com")
        p.page.select_option("#sujet", "Demande de devis")
        p.page.fill("#message", "Message de test automatisé.")
        with p.page.expect_navigation():
            p.page.click("button[type='submit']")
        assert "envoye=1" in p.page.url, p.page.url
        assert "Message envoyé" in p.page.inner_text("main")
    finally:
        p.close()

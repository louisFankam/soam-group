"""Interactions : FAQ, menu mobile, formulaire de contact."""

from helpers import Page, BASE

MOBILE = {"width": 390, "height": 844}
# panneau mobile uniquement (le nav desktop reste dans le DOM, caché par CSS)
MOBILE_NAV = 'header nav[class*="lg:hidden"]'


def test_faq_accordeon_exclusif(pw):
    p = Page(pw)
    try:
        p.goto()
        faq = p.page.locator("main button[aria-expanded]")
        assert faq.count() == 4
        # le premier est ouvert par défaut
        assert faq.nth(0).get_attribute("aria-expanded") == "true"
        faq.nth(2).click()
        p.page.wait_for_timeout(450)
        assert faq.nth(2).get_attribute("aria-expanded") == "true"
        assert faq.nth(0).get_attribute("aria-expanded") == "false", "l'item 1 doit se fermer"
        # re-cliquer le même referme tout
        faq.nth(2).click()
        p.page.wait_for_timeout(450)
        assert faq.nth(2).get_attribute("aria-expanded") == "false"
    finally:
        p.close()


def test_menu_mobile(pw):
    p = Page(pw, viewport=MOBILE)
    try:
        p.goto()
        burger = p.page.locator('button[aria-label="Menu"]')
        panel = p.page.locator(MOBILE_NAV)
        assert not panel.is_visible(), "le menu doit être fermé au départ"
        burger.click()
        p.page.wait_for_timeout(500)
        assert panel.is_visible(), "le menu doit s'ouvrir"
        # un lien ferme le menu
        p.page.locator(f'{MOBILE_NAV} a[href="/contact"]').first.click()
        p.page.wait_for_timeout(500)
        assert not panel.is_visible(), "le menu doit se fermer après clic sur un lien"
    finally:
        p.close()


def test_formulaire_contact(pw):
    p = Page(pw)
    try:
        p.goto()
        p.page.fill("#nom", "Client Test")
        p.page.fill("#email", "client@test.bf")
        p.page.fill("#tel", "+226 70 00 00 00")
        p.page.select_option("#sujet", index=1)
        p.page.fill("#message", "Demande de devis de test automatisé.")
        p.page.click('button[type="submit"]')
        p.page.wait_for_url("**/contact?envoye=1", timeout=15000)
        assert "envoye=1" in p.page.url
    finally:
        p.close()


def test_champs_requis_formulaire(pw):
    p = Page(pw)
    try:
        p.goto()
        for fid in ("nom", "email", "message"):
            assert (
                p.page.locator(f"#{fid}").get_attribute("required") is not None
            ), f"#{fid} devrait être requis"
        assert p.page.locator("#email").get_attribute("type") == "email"
    finally:
        p.close()


def test_ancres_navigation(pw):
    p = Page(pw)
    try:
        p.goto()
        for ancre in ("expertises", "solutions", "realisations", "logiciels", "contact"):
            assert (
                p.page.locator(f"#{ancre}").count() >= 1
            ), f"ancre #{ancre} introuvable"
    finally:
        p.close()

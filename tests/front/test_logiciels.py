"""Pages Logiciels : listing + toutes les fiches produit."""

from helpers import Page, BASE


def _product_links(p):
    return [a.get_attribute("href") for a in p.page.locator("main a[href^='/logiciels/']").all()]


def test_listing_logiciels(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/logiciels")
        assert "Nos logiciels" in p.page.title()
        links = set(_product_links(p))
        assert len(links) >= 6, f"6 fiches produits attendues ({len(links)})"
    finally:
        p.close()


def test_toutes_les_fiches(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/logiciels")
        links = sorted(set(_product_links(p)))
        assert len(links) >= 6
        for link in links:
            r = p.page.goto(f"{BASE}{link}")
            assert r.status == 200, f"{link} -> {r.status}"
            assert p.page.locator("h1").count() == 1
            body = p.page.inner_text("main")
            for attendu in ("Présentation", "Pourquoi choisir", "Découvrez aussi"):
                assert attendu in body, f"{link}: section '{attendu}' manquante"
    finally:
        p.close()


def test_fiche_school_contenu(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/logiciels/soam-school")
        assert "SOAM SCHOOL" in p.page.locator("h1").inner_text()
        # lien croisé vers contact pour la démo
        assert p.page.locator("main a[href='/contact']").count() >= 1
        p.assert_no_js_errors()
    finally:
        p.close()

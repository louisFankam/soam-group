"""Actualités : listing + articles."""

from helpers import Page, BASE


def test_listing_actualites(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/actualites")
        assert "Actualités" in p.page.title()
        liens = set(
            a.get_attribute("href")
            for a in p.page.locator("main a[href^='/actualites/']").all()
        )
        assert len(liens) == 3, f"3 articles attendus ({len(liens)})"
    finally:
        p.close()


def test_articles_complets(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/actualites")
        for link in sorted(set(
            a.get_attribute("href")
            for a in p.page.locator("main a[href^='/actualites/']").all()
        )):
            r = p.page.goto(f"{BASE}{link}")
            assert r.status == 200, f"{link} -> {r.status}"
            # un article a au moins 3 paragraphes de corps
            n_paras = p.page.locator("article .space-y-5 > p").count()
            assert n_paras >= 3, f"{link}: corps trop court ({n_paras})"
        p.page.goto(f"{BASE}/actualites/lancement-soam-security-v2")
        assert "SOAM SECURITY" in p.page.locator("h1").inner_text()
    finally:
        p.close()


def test_lien_accueil_vers_actualites(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}")
        assert p.page.locator("main a[href='/actualites']").count() >= 1, \
            "l'accueil doit lier vers /actualites"
    finally:
        p.close()

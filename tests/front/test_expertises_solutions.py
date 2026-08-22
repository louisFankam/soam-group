"""Expertises et Solutions : listings + pages détail."""

from helpers import Page, BASE


def test_expertises_listing(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/expertises")
        liens = set(
            a.get_attribute("href")
            for a in p.page.locator("main a[href^='/expertises/']").all()
        )
        assert len(liens) == 10, f"10 expertises attendues ({len(liens)})"
    finally:
        p.close()


def test_expertises_details(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/expertises")
        for link in sorted(set(
            a.get_attribute("href")
            for a in p.page.locator("main a[href^='/expertises/']").all()
        )):
            r = p.page.goto(f"{BASE}{link}")
            assert r.status == 200, f"{link} -> {r.status}"
            body = p.page.inner_text("main")
            assert "Notre approche" in body, f"{link}: approche manquante"
            assert "Nos prestations" in body, f"{link}: prestations manquantes"
        # contenu spécifique
        p.page.goto(f"{BASE}/expertises/cybersecurite")
        assert "Cybersécurité" in p.page.locator("h1").inner_text()
        assert "SOC" in p.page.inner_text("main")
    finally:
        p.close()


def test_solutions_listing_et_details(pw):
    p = Page(pw)
    try:
        # listing : solution phare + 4 solutions
        p.goto(f"{BASE}/solutions")
        liens = set(
            a.get_attribute("href")
            for a in p.page.locator("main a[href^='/solutions/']").all()
        )
        assert len(liens) == 5, f"5 solutions attendues ({liens})"
        # chaque détail répond et contient ses points
        for link in sorted(liens):
            r = p.page.goto(f"{BASE}{link}")
            assert r.status == 200, f"{link} -> {r.status}"
            body = p.page.inner_text("main")
            assert "Ce que comprend l'offre" in body, link
        p.page.goto(f"{BASE}/solutions/sante")
        assert "Solution Santé" in p.page.locator("h1").inner_text()
    finally:
        p.close()

"""Réalisations : filtres fonctionnels + études de cas."""

from helpers import Page, BASE


def test_filtres_portfolio(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/realisations")
        grille = p.page.locator("main .grid").first
        total = grille.locator("a").count()

        p.page.get_by_role("button", name="Énergie", exact=True).click()
        p.page.wait_for_timeout(700)
        visibles_apres_filtre = grille.locator("a:visible").count()
        assert visibles_apres_filtre < total, "le filtre Énergie ne réduit pas la liste"

        p.page.get_by_role("button", name="Tous", exact=True).click()
        p.page.wait_for_timeout(700)
        assert grille.locator("a").count() == total, "le filtre Tous ne restaure pas la liste"
    finally:
        p.close()


def test_etudes_de_cas(pw):
    p = Page(pw)
    try:
        p.goto(f"{BASE}/realisations")
        liens = sorted(set(
            a.get_attribute("href")
            for a in p.page.locator("main a[href^='/realisations/']").all()
        ))
        assert len(liens) == 5, f"5 études de cas attendues ({len(liens)})"
        for link in liens:
            r = p.page.goto(f"{BASE}{link}")
            assert r.status == 200, f"{link} -> {r.status}"
            body = p.page.inner_text("main")
            for section in ("Le contexte", "Notre mission", "Résultats"):
                assert section in body, f"{link}: section '{section}' manquante"
        # contenu d'une étude précise
        p.page.goto(f"{BASE}/realisations/soc-banque-atlantique")
        assert "SOC Banque Atlantique" in p.page.locator("h1").inner_text()
    finally:
        p.close()

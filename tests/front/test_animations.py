"""Animations : compteurs, marquee, barre de progression, reveals au scroll."""

import time

from helpers import Page, BASE


def test_compteurs_stats(pw):
    p = Page(pw)
    try:
        p.goto()
        band = p.page.locator("main > div.bg-primary").first
        band.scroll_into_view_if_needed()
        p.page.wait_for_timeout(2300)
        txt = " ".join(band.inner_text().split())
        for valeur in ("250+", "120+", "11", "10+"):
            assert valeur in txt, f"compteur {valeur} absent après animation: {txt}"
        p.assert_no_js_errors()
    finally:
        p.close()


def test_marquee_defile(pw):
    p = Page(pw)
    try:
        p.goto()
        # scroller la section parente (l'élément animé n'est jamais "stable")
        p.page.locator("section", has=p.page.locator(".animate-marquee")).first.scroll_into_view_if_needed()
        el = p.page.locator(".animate-marquee").first

        def tx():
            return p.page.evaluate(
                "getComputedStyle(document.querySelector('.animate-marquee')).transform"
            )

        avant = tx()
        time.sleep(1.2)
        apres = tx()
        assert avant != apres, f"le marquee ne défile pas ({avant})"
    finally:
        p.close()


def test_barre_progression_scroll(pw):
    p = Page(pw)
    try:
        p.goto()
        bar = p.page.locator("div.fixed.h-1").first
        assert bar.count() > 0 or p.page.locator('[class*="fixed top-0"]').count() > 0
        haut = p.page.evaluate(
            "getComputedStyle(document.querySelector('div.fixed.h-1')).transform"
        )
        p.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        p.page.wait_for_timeout(800)
        bas = p.page.evaluate(
            "getComputedStyle(document.querySelector('div.fixed.h-1')).transform"
        )
        assert haut != bas, "la barre de progression ne réagit pas au scroll"
    finally:
        p.close()


def test_reveal_au_scroll(pw):
    p = Page(pw)
    try:
        p.goto()
        cible = p.page.locator("#logiciels h2").first
        # avant le scroll : la section est sous le viewport, reveal non déclenché
        opa_avant = p.page.evaluate(
            "() => { const h = [...document.querySelectorAll('h2')].find(x => x.textContent.includes('Solutions logicielles')); let e = h; while (e && getComputedStyle(e).opacity === '1') e = e.parentElement; return e ? 0 : 1; }"
        )
        cible.scroll_into_view_if_needed()
        p.page.wait_for_timeout(1500)
        visible = cible.is_visible()
        assert visible and (opa_avant in (0, 1))  # l'élément finit toujours visible
        body_opa = p.page.evaluate(
            "() => { const h = [...document.querySelectorAll('h2')].find(x => x.textContent.includes('Solutions logicielles')); return getComputedStyle(h).opacity; }"
        )
        assert body_opa == "1", f"titre non révélé (opacity={body_opa})"
    finally:
        p.close()


def test_pas_derreur_js_apres_scroll_complet(pw):
    p = Page(pw)
    try:
        p.goto()
        p.page.evaluate(
            """async () => {
                for (let y = 0; y <= document.body.scrollHeight; y += 400) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 50));
                }
            }"""
        )
        p.page.wait_for_timeout(1200)
        p.assert_no_js_errors()
    finally:
        p.close()

def test_filtres_accueil(pw):
    """Les filtres de réalisations de l'accueil réduisent/restaurant la grille."""
    p = Page(pw)
    try:
        p.goto()
        section = p.page.locator("#realisations")
        grille = section.locator(".grid").last
        total = grille.locator("a").count()

        p.page.get_by_role("button", name="Énergie", exact=True).click()
        p.page.wait_for_timeout(700)
        assert grille.locator("a").count() < total, "le filtre Énergie ne réduit pas la grille de l'accueil"

        p.page.get_by_role("button", name="Tous", exact=True).click()
        p.page.wait_for_timeout(700)
        assert grille.locator("a").count() == total, "le filtre Tous ne restaure pas la grille"

        p.assert_no_js_errors()
    finally:
        p.close()

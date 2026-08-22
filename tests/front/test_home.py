"""Structure et contenu de la page d'accueil."""

from helpers import Page, BASE


def test_structure_accueil(pw):
    p = Page(pw)
    try:
        p.goto()
        assert "SOAM GROUP" in p.page.title()
        assert p.page.locator("header img").count() == 1
        assert p.page.locator("header nav a").count() == 7
        assert p.page.locator("h1").count() == 1
        assert p.page.locator("section").count() >= 11
        # grilles (cartes = dernier enfant de chaque Item, div ou a)
        assert (
            p.page.locator("#expertises .grid > div > *").count() == 10
        ), "10 cartes expertise attendues"
        assert (
            p.page.locator("#logiciels .grid > div > *").count() == 6
        ), "6 cartes logiciels attendues"
        assert p.page.locator("main button[aria-expanded]").count() == 4
        # formulaire
        for fid in ("nom", "email", "tel", "sujet", "message"):
            assert p.page.locator(f"#{fid}").count() == 1, f"champ {fid} manquant"
        assert p.page.locator("footer").count() == 1
        p.assert_no_js_errors()
    finally:
        p.close()


def test_images_visibles(pw):
    p = Page(pw)
    try:
        p.goto()
        total = p.page.evaluate("document.images.length")
        broken = p.page.evaluate(
            "Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0 && i.src).length"
        )
        # le logo local (servi via /_next/image) doit toujours charger
        logo_ok = p.page.evaluate(
            "document.querySelector('header img')?.naturalWidth > 0"
        )
        print(f"   images: {total} total, {broken} cassées")
        assert logo_ok, "le logo local doit charger"
        assert broken <= total // 2, "trop d'images cassées"
    finally:
        p.close()


def test_video_hero(pw):
    p = Page(pw)
    try:
        p.goto()
        video = p.page.locator("main video").first
        assert video.count() > 0, "vidéo du hero absente"
        assert video.get_attribute("autoplay") is not None
        assert video.get_attribute("muted") is not None
        assert video.get_attribute("playsinline") is not None
        assert video.get_attribute("loop") is not None
        source = video.locator("source").first
        assert "/videos/hero.mp4" in source.get_attribute("src")
        # la vidéo doit réellement charger
        ok = p.page.evaluate(
            "() => { const v = document.querySelector('main video'); return v.readyState >= 1; }"
        )
        assert ok, "la vidéo ne charge pas (readyState < 1)"
    finally:
        p.close()


def test_contenu_cle(pw):
    p = Page(pw)
    try:
        p.goto()
        body = p.page.inner_text("body")
        for attendu in (
            "domaines d'expertise",
            "Solutions logicielles SOAM",
            "Ce que disent nos clients",
            "Questions fréquentes",
            "Parlons de votre projet",
            "contact@soamgroup.net",
            "Ouagadougou",
        ):
            assert attendu in body, f"contenu manquant: {attendu}"
    finally:
        p.close()

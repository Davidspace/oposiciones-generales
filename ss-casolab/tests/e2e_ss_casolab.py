from pathlib import Path
from tempfile import gettempdir

from playwright.sync_api import sync_playwright


BASE_URL = "http://localhost:3000/ss-casolab"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"


def select_option(page, text: str) -> None:
    option = page.locator("label.ss-option", has_text=text).locator("input")
    assert option.count() == 1, f"No se encontró una opción única: {text}"
    option.check()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=EDGE, headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")

    assert page.get_by_role("heading", name="No memorices otra página. Decide como en el supuesto.").is_visible()
    assert page.get_by_text("CAPTACIÓN PREPARADA").is_visible()
    assert page.get_by_text("ACCESO 6 MESES").is_visible()
    assert page.get_by_text("13", exact=True).is_visible()

    select_option(page, "Irene, porque nunca ha trabajado.")
    page.get_by_role("button", name="Corregir mis decisiones").click()
    assert page.get_by_text("Quedan 4 decisiones en blanco.", exact=False).is_visible()
    page.get_by_role("button", name="Entregar con 4 en blanco").click()
    page.locator("#resultado").wait_for()

    assert page.get_by_text("Confusión de sujetos").is_visible()
    assert page.locator(".ss-option-feedback-list li").count() == 20
    assert "0,25 / 5" in page.locator(".ss-score-card").inner_text()

    page.get_by_role("button", name="Repetir el microcaso").click()
    select_option(page, "La empresa que la contrata.")
    select_option(page, "Antes del inicio de la relación laboral, hasta 60 días naturales antes.")
    select_option(page, "Solicitar directamente su afiliación o alta al organismo competente.")
    select_option(page, "Tres días naturales.")
    select_option(page, "No. La afiliación es única para toda su vida y para todo el sistema.")
    page.get_by_role("button", name="Corregir mis decisiones").click()
    page.locator("#resultado").wait_for()

    assert "5,00 / 5" in page.locator(".ss-score-card").inner_text()
    assert page.get_by_text("Sin fallos en este intento").is_visible()

    screenshot = Path(gettempdir()) / "ss-casolab-e2e.png"
    page.screenshot(path=str(screenshot), full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto(BASE_URL)
    mobile.wait_for_load_state("networkidle")
    assert mobile.get_by_role("heading", name="No memorices otra página. Decide como en el supuesto.").is_visible()
    assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    select_option(mobile, "La empresa que la contrata.")
    mobile.get_by_role("button", name="Corregir mis decisiones").click()
    assert mobile.get_by_role("button", name="Entregar con 4 en blanco").is_visible()
    mobile_screenshot = Path(gettempdir()) / "ss-casolab-e2e-mobile.png"
    mobile.screenshot(path=str(mobile_screenshot), full_page=True)

    print(
        f"E2E correcto. Capturas: {screenshot} y {mobile_screenshot}"
    )
    browser.close()

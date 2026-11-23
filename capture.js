// Maakt een screenshot van de baanbeschikbaarheid van Plaza Padel Enschede (boekingspagina van Padel Casa).
// Gebruik: node capture.js <uitvoerbestand.png>
const { chromium } = require('playwright');

const URL = 'https://www.padelcasa.com/pages/enschede#/court-booking';
const out = process.argv[2] || 'screenshot.png';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 },
    deviceScaleFactor: 2,
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
  });
  const page = await context.newPage();

  const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Een foutpagina (bijv. 403) is geen geldige screenshot: stop met een fout.
  if (!response || response.status() >= 400) {
    throw new Error(`De pagina gaf HTTP ${response ? response.status() : 'geen antwoord'}`);
  }
  await page.waitForTimeout(4000);

  // Cookiebanner: kies de meest privacyvriendelijke optie (weigeren / alleen noodzakelijk).
  const rejectButtons = [
    '#onetrust-reject-all-handler',
    'button:has-text("Alles weigeren")',
    'button:has-text("Weigeren")',
    'button:has-text("Reject all")',
    'button:has-text("Reject")',
    'button:has-text("Decline")',
    'button:has-text("Alleen noodzakelijk")',
    'button:has-text("Only necessary")',
  ];
  for (const sel of rejectButtons) {
    try {
      const b = page.locator(sel).first();
      if (await b.isVisible({ timeout: 1000 })) {
        await b.click();
        console.log('Cookiebanner gesloten met:', sel);
        break;
      }
    } catch (_) {}
  }

  // Wacht tot de beschikbaarheid geladen is (de tekst "Loading" verdwijnt), max. 30 s.
  try {
    await page.waitForFunction(
      () => !/Loading…|Loading\.\.\.|Laden…/.test(document.body.innerText),
      null,
      { timeout: 30000 }
    );
  } catch (_) {
    console.log('Waarschuwing: "Loading" bleef zichtbaar; screenshot wordt toch gemaakt.');
  }
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  // Extra wachttijd: de beschikbaarheid verschijnt pas enkele seconden na het laden.
  await page.waitForTimeout(10000);

  await page.screenshot({ path: out, fullPage: true });
  console.log('Screenshot opgeslagen:', out);
  await browser.close();
})().catch((e) => {
  console.error('Fout:', e.message);
  process.exit(1);
});

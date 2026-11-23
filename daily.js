// Dagelijkse run: maakt de screenshot (met een paar pogingen) en mailt die via Resend.
// Gebruik: node daily.js
// Verwacht de omgevingsvariabelen RESEND_API_KEY, MAIL_FROM en MAIL_TO (zie README).
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PAGE = 'https://www.padelcasa.com/pages/enschede#/court-booking';
const ATTEMPTS = 3;
const WAIT_MINUTES = 5;

const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = process.env;

function amsterdam(options) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam', ...options }).format(new Date());
}

async function sendMail(subject, text, attachment) {
  const body = { from: `Padel screenshot <${MAIL_FROM}>`, to: [MAIL_TO], subject, text };
  if (attachment) {
    body.attachments = [
      { filename: path.basename(attachment), content: fs.readFileSync(attachment).toString('base64') },
    ];
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Resend gaf HTTP ${res.status}: ${await res.text()}`);
}

(async () => {
  for (const name of ['RESEND_API_KEY', 'MAIL_FROM', 'MAIL_TO']) {
    if (!process.env[name]) throw new Error(`Omgevingsvariabele ${name} ontbreekt`);
  }

  const date = amsterdam({ dateStyle: 'short' }); // jjjj-mm-dd
  const file = path.join(os.tmpdir(), `plaza-padel-availability-${date}.png`);

  let ok = false;
  for (let i = 1; i <= ATTEMPTS && !ok; i++) {
    console.log(`Poging ${i} van ${ATTEMPTS}`);
    const run = spawnSync(process.execPath, [path.join(__dirname, 'capture.js'), file], { stdio: 'inherit' });
    ok = run.status === 0 && fs.existsSync(file);
    if (!ok && i < ATTEMPTS) {
      console.log(`Mislukt; nieuwe poging over ${WAIT_MINUTES} minuten.`);
      await new Promise((r) => setTimeout(r, WAIT_MINUTES * 60 * 1000));
    }
  }

  const time = amsterdam({ hour: '2-digit', minute: '2-digit' });
  if (ok) {
    await sendMail(
      `Plaza Padel Enschede beschikbaarheid ${date}`,
      `Dit is de dagelijkse capture van de baanbeschikbaarheid bij Plaza Padel Enschede, gemaakt om ${time} uur.\n` +
        `De vrije tijdsloten voor vanavond staan in de bijgevoegde screenshot.\nPagina: ${PAGE}`,
      file
    );
    fs.unlinkSync(file);
    console.log('Mail met screenshot verstuurd.');
  } else {
    await sendMail(
      `Plaza Padel Enschede beschikbaarheid ${date} (mislukt)`,
      `De dagelijkse screenshot van Plaza Padel Enschede is vandaag (${time} uur) na ${ATTEMPTS} pogingen mislukt.\nPagina: ${PAGE}`
    );
    console.log('Mail over mislukte capture verstuurd.');
    process.exit(1);
  }
})().catch((e) => {
  console.error('Fout:', e.message);
  process.exit(1);
});

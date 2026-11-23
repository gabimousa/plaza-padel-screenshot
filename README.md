# Plaza Padel screenshot

Maakt elke dag rond 17:17 (Nederlandse tijd) een screenshot van de baanbeschikbaarheid van
[Plaza Padel Enschede op Playtomic](https://playtomic.com/clubs/plaza-padel-enschede)
en mailt die als bijlage.

Benodigde secrets (Settings → Secrets and variables → Actions):

- `MAIL_USERNAME`: het Gmail-adres dat de mail verstuurt
- `MAIL_PASSWORD`: een Gmail-app-wachtwoord (niet je gewone wachtwoord)
- `MAIL_TO`: het adres dat de screenshot ontvangt

Handmatig testen: tabblad Actions → "Dagelijkse padel-screenshot" → Run workflow.

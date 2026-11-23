# Plaza Padel screenshot

Maakt elke dag rond 17:17 (Nederlandse tijd) een screenshot van de baanbeschikbaarheid van
[Plaza Padel Enschede op Playtomic](https://playtomic.com/clubs/plaza-padel-enschede)
en mailt die als bijlage.

Benodigde secrets (Settings → Secrets and variables → Actions):

- `MAIL_PASSWORD`: een API-sleutel van [Resend](https://resend.com) (de mail gaat via hun SMTP-server)
- `MAIL_FROM`: het afzenderadres (zonder eigen domein: het testadres van Resend)
- `MAIL_TO`: het adres dat de screenshot ontvangt (zonder eigen domein: het adres van je Resend-account)

Handmatig testen: tabblad Actions → "Dagelijkse padel-screenshot" → Run workflow.

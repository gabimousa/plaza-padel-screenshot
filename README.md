# Plaza Padel screenshot

Maakt elke dag om 17:17 (Nederlandse tijd) een screenshot van de baanbeschikbaarheid van
[Plaza Padel Enschede op Playtomic](https://playtomic.com/clubs/plaza-padel-enschede)
en mailt die als bijlage via [Resend](https://resend.com).

## Dagelijkse run op een eigen server (Docker)

Playtomic blokkeert de servers van GitHub meestal, daarom draait de dagelijkse run op een
eigen server met Docker.

1. Clone deze repository op de server.
2. Maak in de map een bestand `.env` (alleen leesbaar voor jezelf: `chmod 600 .env`):

   ```
   RESEND_API_KEY=<API-sleutel van Resend>
   MAIL_FROM=<afzenderadres; zonder eigen domein het testadres van Resend>
   MAIL_TO=<ontvanger; zonder eigen domein het adres van je Resend-account>
   ```

3. Test met `sh run.sh`. Dat maakt de screenshot (maximaal 3 pogingen, 5 minuten ertussen)
   en verstuurt de mail.
4. Plan het in met `crontab -e`. De regel hieronder start elk uur om :17, maar draait alleen
   door als het in Nederland 17 uur is, zodat zomer- en wintertijd vanzelf kloppen:

   ```
   17 * * * * [ "$(TZ=Europe/Amsterdam date +\%H)" = "17" ] && sh $HOME/plaza-padel-screenshot/run.sh >> $HOME/plaza-padel-screenshot/cron.log 2>&1
   ```

## Handmatig via GitHub Actions

De workflow "Dagelijkse padel-screenshot" is alleen nog handmatig te starten (tabblad Actions →
Run workflow) en gebruikt de secrets `MAIL_PASSWORD` (API-sleutel van Resend), `MAIL_FROM` en
`MAIL_TO`. Vanaf GitHub lukt de capture vaak niet.

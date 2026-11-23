#!/bin/sh
# Draait de dagelijkse capture in een tijdelijke Docker-container (voor gebruik op een server).
# Verwacht een bestand .env in deze map met RESEND_API_KEY, MAIL_FROM en MAIL_TO.
set -e
cd "$(dirname "$0")"
echo "=== $(date) ==="
docker run --rm --ipc=host --memory=1500m \
  --env-file .env \
  -v "$PWD":/work -w /work \
  mcr.microsoft.com/playwright:v1.48.2-jammy \
  sh -c "npm install --no-audit --no-fund && node daily.js"

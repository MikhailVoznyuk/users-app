#!/bin/sh
set -e

echo "[entrypoint] prisma generate"
npx prisma generate || true

echo "[entrypoint] prisma db push"
npx prisma db push --accept-data-loss || true

if [ "${SEED:-true}" = "true" ]; then
  echo "[entrypoint] seeding database"
  if [ -f dist/prisma/seed.js ]; then
    node dist/prisma/seed.js || true
  elif command -v ts-node >/dev/null 2>&1; then
    npx ts-node prisma/seed.ts || true
  else
    echo "[entrypoint] seed skipped (no dist/prisma/seed.js and no ts-node)"
  fi
else
  echo "[entrypoint] skip seeding (SEED=false)"
fi

echo "[entrypoint] starting API"
exec node dist/src/index.js
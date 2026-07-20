#!/usr/bin/env bash
# Run on server: ./scripts/deploy.sh [--pull] [--skip-ci]
# See ../../GUIDELINE.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SKIP_CI=0
DO_PULL=0

for arg in "$@"; do
  case "$arg" in
    --pull) DO_PULL=1 ;;
    --skip-ci) SKIP_CI=1 ;;
    -h|--help)
      echo "Usage: $0 [--pull] [--skip-ci]"
      exit 0
      ;;
    *)
      echo "Usage: $0 [--pull] [--skip-ci]"
      exit 1
      ;;
  esac
done

if [[ "$DO_PULL" -eq 1 ]]; then
  git pull --ff-only
fi

if [[ ! -f .env.production ]]; then
  echo "Missing .env.production — copy from .env.example and set VITE_* values"
  exit 1
fi

LOGIN_PATH_VAL="$(grep -E '^VITE_LOGIN_PATH=' .env.production | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
LOGIN_PATH_VAL="${LOGIN_PATH_VAL:-/ikjnbhg}"
LOGIN_SEGMENT="${LOGIN_PATH_VAL#/}"
if [[ -z "$LOGIN_SEGMENT" ]]; then
  echo "ERROR: VITE_LOGIN_PATH is empty in .env.production"
  exit 1
fi
echo ">> Building with VITE_LOGIN_PATH=${LOGIN_PATH_VAL}"

oom_hint() {
  echo "ERROR: npm was Killed (low memory). Run: sudo ./scripts/setup-swap.sh"
}
trap 'ec=$?; if [[ $ec -eq 137 ]]; then oom_hint; fi' EXIT

if [[ "$SKIP_CI" -eq 1 ]]; then
  [[ -d node_modules ]] || { echo "node_modules missing — run without --skip-ci"; exit 1; }
else
  NODE_OPTIONS="--max-old-space-size=768" npm ci --no-audit --no-fund
fi

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1024}"
npm run build
trap - EXIT

[[ -f dist/index.html ]] || { echo "ERROR: dist/index.html missing"; exit 1; }
if ! grep -Rqs -- "$LOGIN_SEGMENT" dist/assets/*.js; then
  echo "ERROR: built JS missing login path '${LOGIN_SEGMENT}' — check .env.production VITE_LOGIN_PATH"
  exit 1
fi
echo ">> Verified login path '${LOGIN_SEGMENT}' is in the production bundle"

if [[ "$(id -u)" -eq 0 ]]; then
  chown -R www-data:www-data "$ROOT/dist"
  command -v nginx >/dev/null && nginx -t && systemctl reload nginx
fi

echo "Frontend deploy done → $ROOT/dist"

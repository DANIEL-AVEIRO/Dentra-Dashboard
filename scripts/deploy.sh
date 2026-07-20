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

if [[ "$(id -u)" -eq 0 ]]; then
  chown -R www-data:www-data "$ROOT/dist"
  command -v nginx >/dev/null && nginx -t && systemctl reload nginx
fi

echo "Frontend deploy done → $ROOT/dist"

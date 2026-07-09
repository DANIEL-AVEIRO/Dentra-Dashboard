#!/usr/bin/env bash
# One-time: sudo ./scripts/setup-nginx.sh
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WS_ROOT="$(cd "$ROOT/.." && pwd)"
DIST="$ROOT/dist"
CONF_SRC="$ROOT/deploy/nginx/admin.conf"

# shellcheck source=../../scripts/lib/deploy-env.sh
source "$WS_ROOT/scripts/lib/deploy-env.sh"
load_deploy_env "$WS_ROOT"

CONF_DST="/etc/nginx/sites-available/${NGINX_ADMIN_SITE}"

[[ -f "$CONF_SRC" ]] || { echo "Missing $CONF_SRC"; exit 1; }
[[ -f "$DIST/index.html" ]] || { echo "Build first: ./scripts/deploy.sh"; exit 1; }

echo ">> Install ${NGINX_ADMIN_SITE} nginx site"
cp "$CONF_SRC" "$CONF_DST"
ln -sf "$CONF_DST" "/etc/nginx/sites-enabled/${NGINX_ADMIN_SITE}"

nginx -t
systemctl reload nginx

if command -v certbot >/dev/null 2>&1; then
  if ! grep -q "ssl_certificate" "$CONF_DST" 2>/dev/null; then
    certbot --nginx -d "$ADMIN_DOMAIN"
  fi
else
  echo "Tip: certbot --nginx -d $ADMIN_DOMAIN"
fi

chown -R www-data:www-data "$DIST" 2>/dev/null || true
echo "Admin nginx setup done."

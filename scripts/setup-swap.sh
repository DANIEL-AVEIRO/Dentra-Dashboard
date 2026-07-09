#!/usr/bin/env bash
# One-time on 2GB droplet — prevents npm ci / vite build OOM (Killed).
# Run as root: ./scripts/setup-swap.sh
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

SWAPFILE=/swapfile
SIZE_GB="${1:-2}"

if swapon --show | grep -q "$SWAPFILE"; then
  echo "Swap already active:"
  swapon --show
  free -h
  exit 0
fi

echo ">> Creating ${SIZE_GB}G swap at $SWAPFILE"
fallocate -l "${SIZE_GB}G" "$SWAPFILE" 2>/dev/null || dd if=/dev/zero of="$SWAPFILE" bs=1M count=$((SIZE_GB * 1024)) status=progress
chmod 600 "$SWAPFILE"
mkswap "$SWAPFILE"
swapon "$SWAPFILE"

if ! grep -q "$SWAPFILE" /etc/fstab; then
  echo "$SWAPFILE none swap sw 0 0" >> /etc/fstab
fi

echo ">> Done"
free -h
swapon --show

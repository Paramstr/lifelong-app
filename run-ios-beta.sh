#!/usr/bin/env bash
# Helper to run the app on a chosen iOS simulator runtime (defaults to the iOS 26.2 beta devices).
# Configuration is overridden via ios/.simulator.env.local if present.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT_DIR/ios/.simulator.env.local"

# Load user overrides if the env file exists
if [ -f "$ENV_FILE" ]; then
  # shellcheck source=/dev/null
  source "$ENV_FILE"
fi

# Defaults
DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode-beta.app/Contents/Developer}"
SIM_DEVICE="${SIM_DEVICE:-iPhone 17 Pro}"
SIM_OS="${SIM_OS:-26.2}"
SIM_UDID="${SIM_UDID:-8B4EAD6E-1380-4E84-B7F6-74D1E6A14A75}" # iPhone 17 Pro (iOS 26.2)

export DEVELOPER_DIR

cd "$ROOT_DIR"

# Ensure the requested simulator exists
if ! xcrun simctl list devices available | grep -q "$SIM_UDID"; then
  echo "Simulator with UDID $SIM_UDID not found. Update SIM_UDID in ios/.simulator.env.local."
  exit 1
fi

# Boot the simulator (idempotent) and open the app
xcrun simctl bootstatus "$SIM_UDID" -b || xcrun simctl boot "$SIM_UDID" || true
open -a Simulator >/dev/null 2>&1 || true

# Run the app on the chosen simulator device (prefer UDID to avoid name collisions)
npx expo run:ios --device "$SIM_UDID" "$@"

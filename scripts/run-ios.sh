#!/usr/bin/env bash
# Helper to run the app on a chosen iOS simulator runtime.
# Automatically detects the best available simulator if not specified.
# Configuration is overridden via ios/.simulator.env.local if present.
set -eo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/ios/.simulator.env.local"

# Load user overrides if the env file exists
if [ -f "$ENV_FILE" ]; then
  # shellcheck source=/dev/null
  source "$ENV_FILE"
fi

# Function to find a simulator UDID by name
find_simulator_udid() {
  local name="$1"
  # Grep for the name, get the first line, then extract the UUID using regex.
  xcrun simctl list devices available | grep "$name" | head -n 1 | grep -oE '[0-9A-F-]{36}'
}

# Defaults
# 1. Try to find "iPhone 17 Pro" first (user's preferred newest)
# 2. Fallback to "iPhone 16 Pro"
# 3. Fallback to any booted device
DEFAULT_SIM_NAME="iPhone 17 Pro"
DETECTED_UDID=$(find_simulator_udid "$DEFAULT_SIM_NAME")

if [ -z "$DETECTED_UDID" ]; then
    DEFAULT_SIM_NAME="iPhone 16 Pro"
    DETECTED_UDID=$(find_simulator_udid "$DEFAULT_SIM_NAME")
fi

# If specific UDID is set in env, use it. Otherwise use detected.
SIM_UDID="${SIM_UDID:-$DETECTED_UDID}"

export DEVELOPER_DIR="${DEVELOPER_DIR:-$(xcode-select -p)}"

echo "🚀 Configuration:"
echo "   Xcode: $DEVELOPER_DIR"
echo "   Simulator: $DEFAULT_SIM_NAME ($SIM_UDID)"

if [ -z "$SIM_UDID" ]; then
  echo "❌ Error: Could not find a suitable simulator ($DEFAULT_SIM_NAME). Please check your available simulators with 'xcrun simctl list'."
  exit 1
fi

cd "$ROOT_DIR"

# Ensure the requested simulator exists (double check)
if ! xcrun simctl list devices available | grep -q "$SIM_UDID"; then
  echo "❌ Error: Simulator with UDID $SIM_UDID not found."
  exit 1
fi

# Boot the simulator (idempotent) and open the app
echo "📱 Booting simulator..."
xcrun simctl bootstatus "$SIM_UDID" -b || xcrun simctl boot "$SIM_UDID" || true
open -a Simulator >/dev/null 2>&1 || true

# Run the app on the chosen simulator device
echo "🏃 Running app..."
npx expo run:ios --device "$SIM_UDID" "$@"

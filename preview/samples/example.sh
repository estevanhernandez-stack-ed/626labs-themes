#!/usr/bin/env bash
# 626 Labs — sample bash for the theme preview.

set -euo pipefail

readonly BRAND_CYAN="#17d4fa"
readonly BRAND_MAGENTA="#f22f89"
readonly REPO_DIR="${HOME}/Projects/626labs-night"

log() {
  local level="$1"; shift
  printf '[%s] %s\n' "${level}" "$*" >&2
}

build_theme() {
  local variant="${1:-night}"
  case "${variant}" in
    night|storm)
      log info "building ${variant}…"
      ;;
    *)
      log error "unknown variant: ${variant}"
      return 1
      ;;
  esac
  npx --yes -p @vscode/vsce vsce package
}

main() {
  cd "${REPO_DIR}"
  build_theme "${1:-night}"
  log ok "packaged for ${BRAND_CYAN} + ${BRAND_MAGENTA}"
}

main "$@"

#!/usr/bin/env bash
# Runs on the droplet (piped over SSH by the deploy workflow):
#   remote-deploy.sh <image-tag> <image-source-label>
# Deploys the given tag with compose's health gate, rolls back to the previously
# running tag if it never becomes healthy, and records the release.
set -euo pipefail

new="$1"
source_label="$2"

# Other apps' deploys leave their expired GHCR tokens in the shared
# ~/.docker/config.json, and the registry denies a public pull that presents one.
# An empty config pulls this public image anonymously.
DOCKER_CONFIG=$(mktemp -d)
export DOCKER_CONFIG
trap 'rm -rf "$DOCKER_CONFIG"' EXIT

cd /opt/portfolio

healthy() {
    IMAGE_TAG="$1" docker compose up -d --wait --wait-timeout 120 app &&
        curl -fsS -o /dev/null --max-time 10 http://127.0.0.1:3002/
}

prev=$(docker inspect --format '{{.Config.Image}}' portfolio 2>/dev/null | sed 's/.*://') || true
prev=${prev:-latest}
echo "deploying $new (running: $prev)"

IMAGE_TAG="$new" docker compose pull app

if healthy "$new"; then
    printf 'IMAGE_TAG=%s\nPREVIOUS_TAG=%s\nDEPLOYED_AT=%s\n' \
        "$new" "$prev" "$(date -u +%FT%TZ)" >release.env
    docker image prune -af \
        --filter "label=org.opencontainers.image.source=$source_label" \
        --filter 'until=168h' ||
        echo "::warning::image prune failed; old images remain on disk"
    exit 0
fi

echo "::error::$new failed its health check; rolling back to $prev"
IMAGE_TAG="$new" docker compose logs --tail 200 app || true
if healthy "$prev"; then
    echo "::error::rolled back; production is serving $prev"
else
    echo "::error::ROLLBACK TO $prev FAILED; production is likely down"
    IMAGE_TAG="$prev" docker compose logs --tail 200 app || true
fi
exit 1

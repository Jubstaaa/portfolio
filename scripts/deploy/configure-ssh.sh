#!/usr/bin/env bash
# Writes an SSH config for the droplet from the Production environment secrets.
# Plain OpenSSH with a pinned host key: no third-party action ever holds the key,
# and a spoofed host is refused.
set -euo pipefail

: "${SSH_KEY:?}" "${KNOWN_HOSTS:?secret DO_KNOWN_HOSTS is not set}" "${DO_HOST:?}" "${DO_USER:?}"

install -m 700 -d ~/.ssh
printf '%s\n' "$SSH_KEY" >~/.ssh/id_deploy
chmod 600 ~/.ssh/id_deploy
printf '%s\n' "$KNOWN_HOSTS" >~/.ssh/known_hosts
cat >~/.ssh/config <<CONFIG
Host droplet
  HostName $DO_HOST
  User $DO_USER
  IdentityFile ~/.ssh/id_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking yes
  ConnectTimeout 15
CONFIG

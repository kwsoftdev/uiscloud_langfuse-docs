# Local dev container for langfuse-docs (Next.js + Fumadocs).
# Mirrors the AGENTS.md quickstart: Node 22, pnpm, dev server on port 3333.
# This is a dev-mode image (bind-mounts friendly, no production build) meant
# for running/verifying the site locally under Docker — not for deployment.
FROM node:22-slim

WORKDIR /app

# fumadocs-mdx's lastModified() plugin shells out to `git log` per content
# file to compute last-modified dates — required even in dev mode.
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/* \
    && git config --global --add safe.directory /app

RUN corepack enable && corepack prepare pnpm@9.5.0 --activate

# postinstall.sh (agent shim sync) needs the rest of the repo, so copy
# everything before installing rather than layer-caching on the lockfile
# alone. This is a dev-only image where rebuild speed isn't critical.
COPY . .
RUN pnpm install --frozen-lockfile

EXPOSE 3333

# The repo's `pnpm dev` script hardcodes `-H 127.0.0.1`, which inside a
# container is only reachable from within that same container. Bind to
# 0.0.0.0 here instead so the published port works from the host too.
CMD ["npx", "next", "dev", "-p", "3333", "-H", "0.0.0.0"]

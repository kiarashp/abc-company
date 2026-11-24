# The app's box (Docker image: a sealed box with the app and everything it needs to run).
# Built on GitHub, never on the server (see .github/workflows/deploy.yml at the top of the repo):
# a build uses all CPUs for a while and would slow down the other live sites.

# 1. Build: install everything, build the site, then drop the build-only packages.
FROM node:24-slim AS build
WORKDIR /app
RUN npm install -g pnpm@12.18.0
# Packages first, code after: when only code changes, the slow install is reused from the cache.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod --ignore-scripts

# 2. Run: only the built site and the packages it needs at run time.
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    # adapter-node settings. Caddy (the front door) is the only way in, so its headers can be trusted:
    # the visitor's real address (needed for the contact form's per-visitor limit),
    # and the site's real address (https + name), which the "log in with GitHub" links use.
    ADDRESS_HEADER=X-Forwarded-For \
    XFF_DEPTH=1 \
    PROTOCOL_HEADER=X-Forwarded-Proto \
    HOST_HEADER=X-Forwarded-Host \
    NODE_OPTIONS=--max-old-space-size=96
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
# The folder for the day's email count; a Docker volume is mounted here and keeps this owner.
RUN mkdir /data && chown node:node /data
# Run as the plain "node" user, not root (if someone breaks in, they get less).
USER node
EXPOSE 3000
CMD ["node", "build"]

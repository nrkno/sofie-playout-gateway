# syntax=docker/dockerfile:experimental
# BUILD IMAGE
FROM node:8.11.4
WORKDIR /opt/playout-gateway
COPY . .
RUN yarn install --check-files --frozen-lockfile
RUN yarn build
RUN yarn install --check-files --frozen-lockfile --production --force # purge dev-dependencies

# DEPLOY IMAGE
FROM node:8.11.4-alpine
RUN apk add --no-cache tzdata
COPY --from=0 /opt/playout-gateway /opt/playout-gateway
WORKDIR /opt/playout-gateway
CMD ["yarn", "start"]

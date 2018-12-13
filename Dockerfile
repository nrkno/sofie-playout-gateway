# syntax=docker/dockerfile:experimental
# BUILD IMAGE
FROM node:8.11.4 AS build
WORKDIR /opt/playout-gateway
COPY . .
RUN --mount=type=cache,target=/opt/playout-gateway/node_modules yarn install --check-files --frozen-lockfile
RUN --mount=type=cache,target=/opt/playout-gateway/node_modules yarn build

# DEPLOY IMAGE
FROM node:8.11.4-alpine
RUN apk add --no-cache tzdata
COPY --from=build /opt/playout-gateway /opt/playout-gateway
WORKDIR /opt/playout-gateway
CMD ["yarn", "start"]

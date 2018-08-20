# BUILD IMAGE
FROM node:8.11.1 AS build
WORKDIR /opt/playout-gateway
COPY . .
RUN yarn install --check-files --frozen-lockfile
RUN yarn build

# DEPLOY IMAGE
FROM node:8.11.1-alpine
RUN apk add --no-cache tzdata
COPY --from=build /opt/playout-gateway /opt/playout-gateway
WORKDIR /opt/playout-gateway
CMD ["yarn", "start"]

FROM node:14.18-alpine3.12 AS build-stage

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html



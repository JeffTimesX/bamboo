FROM node:16-alpine3.12 AS build-stage

RUN apk upgrade && apk add tcptraceroute iproute2 iptables curl wget

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm ci

COPY ["./src", "./src"]

COPY ["./public","./public"]

COPY [".env.pro.compose", ".env"]

RUN npm run build

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"] 

FROM node:12-alpine
RUN apk update && apk add --no-cache gcc make python3
WORKDIR /stock-api
COPY . .
RUN npm install --save-dev
CMD ["node", "src/server.js"]

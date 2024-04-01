FROM ghcr.io/puppeteer/puppeteer:22.6.2

USER root

# install make
RUN apt-get update && apt-get install -y make

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]

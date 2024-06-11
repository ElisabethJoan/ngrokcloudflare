FROM node:current-alpine

ENV SERVER_ADDRESS=yourserverip
ENV NGROK_AUTH_TOKEN=ngrokauthtoken
ENV CF_AUTH_EMAIL=example@provider.com
ENV CF_AUTH_KEY=globalapikey
ENV SERVICE_URL=servicename.example.com
ENV SERVICE_NAME=servicename

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "app.js"]

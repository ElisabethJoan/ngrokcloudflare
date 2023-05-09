FROM node:current-alpine

ENV SERVER_ADDRESS=yourserverip
ENV NGROK_AUTH_TOKEN=ngrokauthtoken
ENV CF_AUTH_EMAIL=example@provider.com
ENV CF_AUTH_KEY=globalapikey
ENV CNAME_NAME=cnamename
ENV SRV_NAME=srvname

WORKDIR /usr/src/app
#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "app.js"]

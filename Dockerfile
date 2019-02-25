FROM node:10-alpine

RUN mkdir -p /home/node/siren/node_modules && chown -R node:node /home/node/siren

WORKDIR /home/node/siren

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "index.js" ]
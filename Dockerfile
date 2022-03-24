FROM node:16-alpine as builder

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm i

COPY --chown=node:node . .
RUN npm run build

FROM node:16-alpine

USER root
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.env ./.env

CMD ["node", "dist/src/index.js"]
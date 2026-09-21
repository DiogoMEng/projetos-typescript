FROM node:18-alpine

RUN apk add --no-cache sqlite

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
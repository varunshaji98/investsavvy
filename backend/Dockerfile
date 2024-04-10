FROM node:10-alpine
MAINTAINER "varunshaji@hotmail.com"
LABEL org.opencontainers.image.source https://github.com/varunshaji98/investsavvy

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
RUN ls
CMD [ "node", "main.js" ]
FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN rm package*.json

COPY public ./public
COPY names ./names
COPY app.js ./app.js

EXPOSE 3000
USER node 
CMD [ "node", "server.js" ]
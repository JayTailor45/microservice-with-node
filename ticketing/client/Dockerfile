FROM node:alpine3.18

ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
FROM node:20.3-buster

WORKDIR /sad-05-2023-project-9lives-backend

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start


FROM node:20-alpine3.17

WORKDIR /sad-05-2023-project-9lives-backend
COPY package.json .
RUN npm install
COPY . .
CMD npm start

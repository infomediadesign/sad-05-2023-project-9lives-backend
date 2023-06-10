FROM node:gallium-buster

WORKDIR /sad-05-2023-project-9lives-backend
COPY .json .
RUN npm install
COPY . .
CMD npm start

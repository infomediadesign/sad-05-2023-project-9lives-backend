FROM node:gallium-buster

WORKDIR /sad-05-2023-project-9lives-backend
COPY .json .
RUN npm initialise
COPY . .
CMD nodemon start

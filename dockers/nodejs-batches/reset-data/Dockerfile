FROM node:18.20.2-slim
COPY ./ /app
WORKDIR /app

RUN yarn run sequelize db:seed:undo:all
RUN yarn run sequelize db:seed:all
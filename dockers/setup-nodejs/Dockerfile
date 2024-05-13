FROM node:18.20.2-slim
COPY ./ /app
WORKDIR /app

RUN apt update
RUN apt install -y default-mysql-client
RUN yarn install
RUN yarn run sequelize db:create
RUN yarn run sequelize db:migrate
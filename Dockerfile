FROM node:16-alpine

RUN npm install -g nodemon

WORKDIR /app

ENV DEV_NODE_ENVIROMMENT=production


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5913
ENTRYPOINT ["nodemon" ,"./bin/www"]
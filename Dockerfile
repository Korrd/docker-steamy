#Lightweight linux
FROM node:7-alpine

RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package.json /app/
COPY index.* /app/
COPY static/ /app/

RUN npm install

EXPOSE 3000 

ENTRYPOINT ["npm", "start"]

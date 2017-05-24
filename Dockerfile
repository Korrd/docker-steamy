#Lightweight linux. 35mb vs 280 for standard node image
FROM node:7-alpine

RUN mkdir -p /app
WORKDIR /app

# Copy app to workdir
COPY package.json /app/
COPY index.* /app/
COPY static/ /app/

#Install docker 17.05+
COPY repositories /etc/apk/ #Edge repo, otherwise it would install docker 1.11 which has no swarm support
RUN apk update
RUN apk add docker

RUN npm install

EXPOSE 3000 

ENTRYPOINT ["npm", "start"]

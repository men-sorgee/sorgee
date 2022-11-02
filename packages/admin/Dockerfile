FROM node:16-alpine

WORKDIR /directus

ADD . /directus

RUN npm install

ENV ENV="/directus/profile" 

CMD ["npm", "run", "start"]
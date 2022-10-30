FROM node:16-alpine

WORKDIR /directus

ADD . /directus

RUN npm install --production

ENV ENV="/directus/profile" 

CMD ["npm", "run", "start"]
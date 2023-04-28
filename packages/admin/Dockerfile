FROM node:18-alpine

WORKDIR /directus

ADD package.json .
RUN npm install

ADD extensions ./extensions
ENV ENV="/directus/profile" 

CMD ["npm", "run", "start"]
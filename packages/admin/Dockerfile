FROM directus/directus:10.5.2

WORKDIR /directus

# USER root
# RUN corepack enable \
#   && corepack prepare pnpm@8.3.1 --activate
# 
# USER node
# RUN pnpm install moment uuid

ADD package.json .
RUN npm install

ADD extensions ./extensions
ENV ENV="/directus/profile" 

CMD ["npm", "run", "start"]

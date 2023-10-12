FROM directus/directus:10.5.2

WORKDIR /directus

USER root
RUN corepack enable \
  && corepack prepare pnpm@8.3.1 --activate

USER node
#RUN pnpm install pg \
#  @wellenplan/directus-extension-duration-display \
#  @wellenplan/directus-extension-duration-interface@0.1.16\
#  directus-extension-ai-operation-bundle@1.0.8 \
#  directus-extension-api-trigger-interface@1.0.0 \
#  directus-extension-display-link@1.6.1 \
#  directus-extension-editorjs@1.5.0 \
#  directus-extension-grid-layout@1.0.2 \
#  directus-extension-group-modal-interface@1.2.0 \
#  directus-extension-masked-interface@1.1.0 \
#  directus-extension-schema-management-module@1.3.0 \
#  directus-extension-sparkline-display@1.0.5 \
#  directus-extension-tags-m2m-interface@0.8.0 \
#  directus-extension-vgrid-interface@1.0.15 

ADD package.json .
RUN pnpm install

ADD extensions ./extensions
ENV ENV="/directus/profile" 

CMD ["npm", "run", "start"]

#stage 1
FROM node:14.17.1 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
#stage 2
### MAINTAINER AND PROJECT TAGS
  LABEL developer="Evvo-IN"
  LABEL packager="Evvo-SG"
  LABEL release-date="26-09-2023"
  LABEL environment="PRODUCTION"
  LABEL app-name="MEGA_WEB_ADMIN"
  LABEL project_name="MEGA_ADVENTURE"
FROM nginx:alpine
COPY --from=node /app/dist/senoko /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


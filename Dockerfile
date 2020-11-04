FROM quay.io/consoleconnect/console_core_service_nodejs:latest

ARG RUN_ROOT=root
ARG RUN_USER=platform
ARG RUN_USER_UID=11020
ARG RUN_USER_GID=11020

ARG USER_HOME=/opt/app


# Copy all files in the repo to the Docker $HOME directory
# Any files you don't want copied into the Docker context add them to the
# .dockerignore file (similar syntax to .gitignore)

COPY . .

RUN echo `date -u +"%FT%T.000Z"` > release.txt

RUN npm install --production

EXPOSE 7001

# https://banzaicloud.com/blog/nodejs-in-production/
CMD ["npm",  "start"]

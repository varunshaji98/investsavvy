FROM ubuntu:18.04
MAINTAINER "varunshaji@hotmail.com"
EXPOSE 3000
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Singapore

WORKDIR /app
COPY . .
RUN apt-get update
RUN apt-get install -y nodejs npm
RUN npm install
CMD ["node","main.js"]
FROM mcr.microsoft.com/devcontainers/base:1-bookworm

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get install fonts-powerline postgresql-client nano -y

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

USER programisto

EXPOSE 3000

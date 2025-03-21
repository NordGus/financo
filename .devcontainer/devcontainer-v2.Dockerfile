FROM node:22-alpine AS js-tooling
FROM mcr.microsoft.com/devcontainers/go:1.23

# Node setup

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get install fonts-powerline postgresql-client nano git -y

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

EXPOSE 3000

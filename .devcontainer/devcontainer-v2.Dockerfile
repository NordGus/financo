ARG GO_VERSION=1.23

FROM mcr.microsoft.com/devcontainers/go:${GO_VERSION}
ARG NODE_VERSION=22

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get install fonts-powerline postgresql-client nano git -y

# giving access to /go/pkg to all users
RUN chmod -R a+w /go/pkg

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

USER vscode

ENV NVM_DIR=/home/vscode/.nvm

# Installing NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Installing node
RUN \. $NVM_DIR/nvm.sh && nvm install ${NODE_VERSION}

EXPOSE 3000

ARG GO_VERSION=1.23

FROM mcr.microsoft.com/devcontainers/go:${GO_VERSION}
ARG NODE_VERSION=22

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get install fonts-powerline postgresql-client nano git -y

# installing air-verse/air for hot reloading
RUN go install github.com/air-verse/air@latest

# installing pressly/goose for handling migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# installing go-delve/delve to debug go programs
RUN go install github.com/go-delve/delve/cmd/dlv@latest

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

USER vscode

# Installing NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# Installing node
RUN nvm install ${NODE_VERSION}

EXPOSE 3000

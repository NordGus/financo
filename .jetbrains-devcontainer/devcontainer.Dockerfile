# The Go setup is based on the [Medium article by Quentin McGaw](https://medium.com/@quentin.mcgaw/ultimate-go-dev-container-for-visual-studio-code-448f5e031911) from Sep 13, 2019.
# The node setup is based on the [Medium article by Csaba Apagyi](https://medium.com/geekculture/how-to-install-a-specific-node-js-version-in-an-alpine-docker-image-3edc1c2c64be) from Dec 7, 2021.

ARG GO_VERSION
ARG NODE_VERSION

FROM node:${NODE_VERSION}-bookworm as node
FROM golang:${GO_VERSION}-bookworm
ARG PNPM_VERSION
ARG GO_AIR_VERSION
ARG GO_GOOSE_VERSION

# Node setup

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin
COPY --from=node /opt /opt

# install packages
RUN apt update -y && apt install -y git make openssh-client zsh nano procps

# updating npm
RUN npm install -g pnpm@$PNPM_VERSION

# installing cosmtrek/air for hot reloading
RUN go install github.com/air-verse/air@$GO_AIR_VERSION

# installing pressly/goose for handling migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@$GO_GOOSE_VERSION

ENV ZSH=$HOME/.oh-my-zsh
ENV EDITOR=nano
ENV LANG=en_US.UTF-8

RUN chmod -R a+w /go/pkg

EXPOSE 3000 5173
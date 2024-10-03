# The Go setup is based on the [Medium article by Quentin McGaw](https://medium.com/@quentin.mcgaw/ultimate-go-dev-container-for-visual-studio-code-448f5e031911) from Sep 13, 2019.
# The node setup is based on the [Medium article by Csaba Apagyi](https://medium.com/geekculture/how-to-install-a-specific-node-js-version-in-an-alpine-docker-image-3edc1c2c64be) from Dec 7, 2021.

ARG GO_VERSION
ARG ALPINE_VERSION
ARG NODE_VERSION

FROM node:20-alpine3.20 AS js-tooling
FROM golang:1.23-alpine3.20
ARG NPM_VERSION
ARG GO_AIR_VERSION
ARG GO_GOOSE_VERSION
ARG GO_DELVE_VERSION
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

# Node setup

COPY --from=js-tooling /usr/lib /usr/lib
COPY --from=js-tooling /usr/local/share /usr/local/share
COPY --from=js-tooling /usr/local/lib /usr/local/lib
COPY --from=js-tooling /usr/local/include /usr/local/include
COPY --from=js-tooling /usr/local/bin /usr/local/bin
COPY --from=js-tooling /opt /opt

# User setup

RUN adduser $USERNAME -s /bin/sh -D -u $USER_UID $USER_GID && \
    mkdir -p /etc/sudoers.d && \
    echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

# install packages
RUN apk add -q --update --progress --no-cache git make sudo openssh-client zsh nano postgresql16-client

# updating npm
RUN npm install -g npm@$NPM_VERSION

# installing cosmtrek/air for hot reloading
RUN go install github.com/air-verse/air@$GO_AIR_VERSION

# installing pressly/goose for handling migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@$GO_GOOSE_VERSION

# installing go-delve/delve to debug go programs
RUN github.com/go-delve/delve/cmd/dlv@$GO_DELVE_VERSION

# Setup shell
USER $USERNAME
RUN sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended &> /dev/null

ENV ENV="/home/$USERNAME/.ashrc"
ENV ZSH=/home/$USERNAME/.oh-my-zsh
ENV EDITOR=nano
ENV LANG=en_US.UTF-8

RUN echo 'ZSH_THEME="robbyrussell"' >> "/home/$USERNAME/.zshrc" \
    && echo 'ENABLE_CORRECTION="false"' >> "/home/$USERNAME/.zshrc" \
    && echo 'plugins=(git copyfile extract colorize dotenv encode64 golang)' >> "/home/$USERNAME/.zshrc" \
    && echo 'source $ZSH/oh-my-zsh.sh' >> "/home/$USERNAME/.zshrc"
RUN echo "exec `which zsh`" > "/home/$USERNAME/.ashrc"
USER root

RUN chmod -R a+w /go/pkg

EXPOSE 3000 5173
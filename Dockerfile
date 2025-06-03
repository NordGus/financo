FROM node:slim AS js-tooling
FROM golang:1.24-bookworm AS go-tooling
RUN apt-get update && \
    apt-get full-upgrade -y && \
    apt install git postgresql-client -y && \
    apt autoremove -y

FROM go-tooling AS devcontainer

# Node setup

COPY --from=js-tooling /usr/lib /usr/lib
COPY --from=js-tooling /usr/local/share /usr/local/share
COPY --from=js-tooling /usr/local/lib /usr/local/lib
COPY --from=js-tooling /usr/local/include /usr/local/include
COPY --from=js-tooling /usr/local/bin /usr/local/bin
COPY --from=js-tooling /opt /opt

# installing cosmtrek/air for hot reloading
RUN go install github.com/air-verse/air@latest

# installing pressly/goose for handling migrations
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# installing go-delve/delve to debug go programs
RUN go install github.com/go-delve/delve/cmd/dlv@latest

RUN chmod -R a+w /go/pkg

EXPOSE 3000 5173

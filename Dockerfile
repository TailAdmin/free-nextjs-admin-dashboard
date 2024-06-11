FROM node:20 as base

# AFJ specifc setup
WORKDIR /www
ENV RUN_MODE="docker"

COPY package.json package.json
COPY yarn.lock yarn.lock
# COPY ./patches ./patches

# Run install after copying only depdendency file
# to make use of docker layer caching
RUN yarn install

# Copy other depdencies
COPY ./src ./src
COPY ./public ./public

COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY nest-cli.json nest-cli.json

RUN yarn build
CMD yarn start
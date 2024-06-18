FROM node:20-alpine as base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

# CMD ["yarn", "start"]
CMD ["yarn", "dev"]
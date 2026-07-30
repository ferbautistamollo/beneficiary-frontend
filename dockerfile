FROM node:24.4.1-alpine3.21

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm config set minimumReleaseAge 0 && pnpm i --frozen-lockfile --ignore-scripts

COPY . .
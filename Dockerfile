FROM node:18.14.2-alpine as base
WORKDIR /app
COPY . /app
RUN apk add --update python3 make gcc g++ && npm install && npm run build

FROM node:18.14.2-alpine
WORKDIR /app
RUN apk add --update python3 make gcc g++
COPY package.json .
COPY package-lock.json .
RUN adduser -h /tmp -s /sbin/nologin -D -H -u 1001 app && \
  chown -R app:app /app
COPY --chown=app:app --from=base /app/dist /app/dist
USER app

RUN npm install --omit=dev
CMD [ "npm", "run", "start:prod" ]

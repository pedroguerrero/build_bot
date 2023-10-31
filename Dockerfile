FROM node:20.9.0-alpine as base
WORKDIR /app
COPY . /app
RUN npm install && npm run build

FROM node:20.9.0-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY --chown=app:app --from=base /app/dist /app/dist
COPY --chown=app:app src/assets /app/dist/assets
RUN adduser -h /tmp -s /sbin/nologin -D -H -u 1001 app && \
  mkdir /app/dist/upload && \
  chown -R app:app /app
USER app
RUN npm install --omit=dev
CMD [ "npm", "run", "start:prod" ]

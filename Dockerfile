FROM node:16-alpine as builder

ENV YARN_VERSION=1.22.19
RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn
COPY package.json yarn.lock tsconfig.json .
COPY src src
RUN yarn \
    && npm install -g @nestjs/cli \
    && nest build

# Multistage - production runtime 
FROM node:16-alpine as runner
ENV DB_HOST \
    DB_PORT=5432 \
    DB_USERNAME \
    DB_PASSWORD \
    DB_DATABASE=domain-information \
    VIRUS_TOTAL_ENDPOINT=https://www.virustotal.com/api/v3/domains \
    WHOIS_ENDPOINT=https://www.whoisxmlapi.com/whoisserver/WhoisService \
    VIRUS_TOTAL_API_KEY \
    WHOIS_API_KEY \
    PERIOD_AGO_TO_SCAN=30*24*60*60*1000
COPY --chown=node --from=builder node_modules/ node_modules/
COPY --chown=node --from=builder dist/ dist/
COPY --chown=node --from=builder package.json yarn.lock tsconfig.json .
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
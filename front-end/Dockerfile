# NPM INSTALL
FROM node:18.20-alpine as dependencies

# Usa un repositorio más estable para openjdk11
RUN apk add --no-cache openjdk11-jre --repository=http://dl-cdn.alpinelinux.org/alpine/v3.12/community
RUN mkdir -p /app
WORKDIR /app

# Copia tanto package.json como package-lock.json (si existe)
COPY package.json package-lock.json /app/

RUN npm install --no-progress

# Angular build
FROM dependencies as build
ARG ENV
COPY . /app

# Asegúrate de que ENV se pasa correctamente
RUN npm run --silent build -- --configuration=$ENV --no-progress

# Final image
FROM nginx:1.19.2-alpine
ARG APP

COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/$APP/browser /usr/share/nginx/html


# Crea el script run.sh con el shebang correcto y dale permisos de ejecución
RUN echo '#!/bin/sh' > /run.sh
RUN echo 'for mainFileName in /usr/share/nginx/html/main*.js ; do' >> /run.sh
RUN echo '  envsubst "\$API_BASE_URL" < "\$mainFileName" > main.tmp ;' >> /run.sh
RUN echo '  mv main.tmp "\${mainFileName}" ;' >> /run.sh
RUN echo 'done' >> /run.sh
RUN echo 'nginx -g "daemon off;"' >> /run.sh

RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]

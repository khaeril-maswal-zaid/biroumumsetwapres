FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git zip unzip curl \
    libldap2-dev \
    nodejs npm \
 && docker-php-ext-install ldap

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

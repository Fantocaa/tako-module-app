FROM dunglas/frankenphp:1-php8.4-alpine AS base

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apk add --no-cache \
    bash \
    zip \
    unzip \
    git \
    curl \
    supervisor \
    tzdata \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    postgresql-dev \
    rabbitmq-c-dev \
    linux-headers \
    nodejs \
    npm \
    shadow

# Install PHP extensions using FrankenPHP helper
RUN install-php-extensions \
    gd \
    pdo_pgsql \
    pgsql \
    opcache \
    bcmath \
    sockets \
    pcntl \
    redis \
    amqp \
    msgpack \
    intl \
    zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Adjust permissions for www-data
ARG WWWUSER=1000
ARG WWWGROUP=1000

RUN groupmod -g ${WWWGROUP} www-data || true \
    && usermod -u ${WWWUSER} www-data || true \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Copy Caddyfile
COPY .docker/php/Caddyfile /etc/caddy/Caddyfile

# Default entrypoint (FrankenPHP comes with its own, but we can wrap it if needed)
FROM base AS dev
RUN install-php-extensions xdebug
COPY .docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=80"]

FROM base AS prod
COPY .docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
RUN composer install --no-dev --optimize-autoloader \
    && npm install && npm run build
CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=80"]

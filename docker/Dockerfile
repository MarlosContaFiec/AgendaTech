FROM php:8.2-cli

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    tesseract-ocr \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev

RUN docker-php-ext-install mysqli pdo pdo_mysql
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

EXPOSE 8000

CMD php -S 0.0.0.0:8000 -t public
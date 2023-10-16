FROM php:latest

RUN docker-php-ext-install pdo pdo_mysql

COPY main /var/www

CMD ["php", "-S", "0.0.0.0:80" , "-t", "/var/www/html"]
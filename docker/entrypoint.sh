#!/bin/sh

if [ ! -d "vendor/autoload.php" ]; then
  echo "📦 Instalando dependências do Composer..."
  composer install --no-interaction --prefer-dist
else
  echo "✅ Dependências já instaladas"
fi

exec "$@"
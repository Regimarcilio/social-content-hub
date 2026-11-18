#!/bin/bash
# Script para abrir o servidor de prévisualização no localhost
echo "🚀 Iniciando servidor de prévisualização do Social Content Hub..."
echo "📍 Porta: 3001"
echo "🌐 URL: http://localhost:3001"
echo ""
echo "Para visualizar uma publicação:"
echo "  http://localhost:3001/preview/completo/:materialId/:plataforma"
echo "  Exemplo: http://localhost:3001/preview/completo/1/linkedin"
echo ""
echo "Pressione Ctrl+C para parar o servidor."
echo ""

# Verificar se o build está disponível
if [ ! -d "dist" ]; then
  echo "📦 Fazendo build do TypeScript..."
  npm run build
fi

# Iniciar o servidor
node dist/preview/servidor-local.js

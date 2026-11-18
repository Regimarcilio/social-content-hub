#!/bin/bash
# Script para abrir o servidor de prévisualização no localhost
echo "🚀 Iniciando servidor de prévisualização do Social Content Hub..."

# Verificar se o build está disponível
if [ ! -d "dist" ]; then
  echo "📦 Fazendo build do TypeScript..."
  npm run build
fi

echo ""
echo "📍 O servidor tentará iniciar na porta 3001"
echo "📍 Se 3001 estiver em uso, tentará 3002, 3003, ... até 3009"
echo "🌐 URL será exibida no terminal após iniciar"
echo ""
echo "Pressione Ctrl+C para parar o servidor."
echo ""

# Iniciar o servidor
node dist/preview/servidor-local.js

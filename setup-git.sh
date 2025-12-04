#!/bin/bash
# Script para configurar Git y subir a GitHub

echo "🚀 Configurando Git para Multi-WhatsApp-Bot"
echo ""

# Verificar si ya existe un remote
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Ya existe un remote 'origin'"
    echo "URL actual: $(git remote get-url origin)"
    read -p "¿Quieres cambiarlo? (s/n): " respuesta
    if [ "$respuesta" = "s" ]; then
        read -p "Ingresa la URL de tu repositorio GitHub: " repo_url
        git remote set-url origin "$repo_url"
    fi
else
    read -p "Ingresa la URL de tu repositorio GitHub: " repo_url
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 Subiendo código a GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ ¡Listo! Tu código está en GitHub"
echo "📝 Siguiente paso: Ve a DEPLOY_RENDER.md para desplegar en Render"


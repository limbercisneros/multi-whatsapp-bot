# 📤 Subir a GitHub y Desplegar en Render

## ✅ Paso 1: Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Nombre del repositorio: `multi-whatsapp-bot` (o el que prefieras)
3. **NO** marques "Add a README file" (ya lo tenemos)
4. Haz clic en "Create repository"

## ✅ Paso 2: Subir el código a GitHub

### Opción A: Desde la terminal (Windows PowerShell)

```powershell
# Reemplaza TU_USUARIO y TU_REPO con tus datos
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### Opción B: Si ya tienes un remote configurado

```powershell
git push -u origin main
```

### Opción C: Usar GitHub CLI (si lo tienes instalado)

```powershell
gh repo create multi-whatsapp-bot --public --source=. --remote=origin --push
```

## ✅ Paso 3: Desplegar en Render

### 3.1 Crear cuenta en Render

1. Ve a [Render](https://render.com)
2. Crea una cuenta (puedes usar GitHub para login rápido)
3. Confirma tu email si es necesario

### 3.2 Crear Web Service

1. En el Dashboard, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu cuenta de GitHub si no lo has hecho
3. Selecciona el repositorio `multi-whatsapp-bot`
4. Render detectará automáticamente la configuración desde `render.yaml`

### 3.3 Configuración del servicio

Render debería detectar automáticamente:
- **Name**: `multi-whatsapp-bot`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (o el que prefieras)

### 3.4 Variables de entorno

En la sección **"Environment"**, agrega estas variables:

```
NODE_ENV=production
PORT=3000
GLOBAL_VERIFY_SALT=tu_salto_secreto_muy_largo_y_seguro
```

> 💡 **Tip**: Genera un salt seguro con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3.5 Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir tu aplicación
3. Espera 2-5 minutos mientras se despliega
4. Verás los logs en tiempo real

### 3.6 Obtener tu URL

Una vez desplegado, Render te dará una URL como:
```
https://multi-whatsapp-bot.onrender.com
```

**¡Guarda esta URL!** La necesitarás para configurar el webhook en Facebook.

## ✅ Paso 4: Configurar bots en producción

### Opción A: Usar Render Shell (Recomendado)

1. En Render Dashboard → Tu servicio → **"Shell"**
2. Ejecuta:
```bash
npm run create-bot "Nombre Cliente" --slug=cliente-slug
```

### Opción B: Editar directamente

1. En Render Dashboard → Tu servicio → **"Shell"**
2. Navega y edita:
```bash
cd bots
mkdir tu-cliente
cd tu-cliente
```

3. Crea `config.json`:
```bash
cat > config.json << 'EOF'
{
  "name": "Tu Cliente",
  "verify_token": "verify_token_seguro_aqui",
  "phone_id": "TU_PHONE_ID",
  "token": "TU_TOKEN",
  "logic_file": "logic.js"
}
EOF
```

4. Crea `logic.js` (copia desde example-bot o crea uno nuevo)

5. Recarga los bots:
```bash
curl https://tu-app.onrender.com/reload-bots
```

## ✅ Paso 5: Configurar webhook en Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Selecciona tu App → **WhatsApp** → **Configuration**
3. En la sección **"Webhook"**, haz clic en **"Edit"**
4. Ingresa:
   - **Callback URL**: `https://tu-app.onrender.com/webhook`
   - **Verify token**: El `verify_token` de tu `config.json` del bot
5. Haz clic en **"Verify and Save"**
6. Selecciona los eventos que quieres recibir (messages, etc.)

## ✅ Paso 6: Probar el bot

1. Envía un mensaje de WhatsApp al número configurado
2. Prueba los comandos:
   - `hola` → Debería responder
   - `menu` → Debería mostrar el menú

## 🔒 Seguridad Importante

### ⚠️ NO subas tokens a GitHub

- Los archivos `bots/*/config.json` están en `.gitignore`
- Solo `bots/example-bot/config.json` se sube (con valores de ejemplo)
- **Nunca** agregues tokens reales al repositorio

### 🔐 Mejores prácticas

1. **Usa variables de entorno** para secretos sensibles
2. **Restringe acceso** al endpoint `/reload-bots` en producción
3. **Considera agregar autenticación** para endpoints administrativos

## 📝 Comandos útiles

### Ver logs en Render
- Dashboard → Tu servicio → **Logs**

### Recargar bots después de cambios
```bash
curl https://tu-app.onrender.com/reload-bots
```

### Verificar que el servicio está activo
```bash
curl https://tu-app.onrender.com/health
```

## 🐛 Solución de problemas

### El servicio no inicia en Render
- Revisa los logs en Render Dashboard
- Verifica que `package.json` tenga el script `start` correcto
- Asegúrate de que el puerto sea `3000` o la variable `PORT` esté configurada

### El webhook no se verifica
- Verifica que la URL sea accesible: `curl https://tu-app.onrender.com/health`
- Asegúrate de que el `verify_token` coincida exactamente
- Revisa los logs del servicio en Render

### El servicio se "duerme" (Plan Free)
- El plan free de Render duerme el servicio después de 15 min de inactividad
- La primera petición puede tardar ~30 segundos en despertar
- Para producción real, considera un plan pago

## 🎉 ¡Listo!

Tu Multi-WhatsApp-Bot SaaS está desplegado y funcionando. Ahora puedes:
- Agregar más bots
- Personalizar la lógica de cada bot
- Integrar con bases de datos
- Agregar un panel admin (ver siguiente paso)


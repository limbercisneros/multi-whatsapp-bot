# 🚀 Guía de Despliegue en Render

## Paso 1: Subir a GitHub

### 1.1 Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. No inicialices con README, .gitignore o licencia (ya los tenemos)

### 1.2 Conectar y subir el código

```bash
# Agregar el remoto (reemplaza TU_USUARIO y TU_REPO)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Hacer commit inicial
git commit -m "Initial commit: Multi-WhatsApp-Bot SaaS"

# Subir a GitHub
git branch -M main
git push -u origin main
```

## Paso 2: Desplegar en Render

### 2.1 Crear cuenta y servicio

1. Ve a [Render](https://render.com) y crea una cuenta (o inicia sesión)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `multi-whatsapp-bot`

### 2.2 Configurar el servicio

Render detectará automáticamente la configuración desde `render.yaml`, pero puedes verificar:

- **Name**: `multi-whatsapp-bot`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (o el que prefieras)

### 2.3 Variables de entorno

En la sección "Environment Variables", agrega:

```
NODE_ENV=production
PORT=3000
GLOBAL_VERIFY_SALT=tu_salto_secreto_aqui
```

### 2.4 Desplegar

1. Haz clic en "Create Web Service"
2. Render comenzará a construir y desplegar tu aplicación
3. Espera a que termine el build (puede tardar 2-5 minutos)

### 2.5 Obtener la URL

Una vez desplegado, Render te dará una URL como:
```
https://multi-whatsapp-bot.onrender.com
```

## Paso 3: Configurar bots en producción

### 3.1 Opción A: Usar Render Shell (recomendado)

1. En Render, ve a tu servicio → "Shell"
2. Ejecuta:
```bash
npm run create-bot "Nombre Cliente" --slug=cliente-slug
```

### 3.2 Opción B: Subir archivos manualmente

1. Usa el panel de Render o conecta por SSH
2. Crea la carpeta `bots/tu-cliente/`
3. Crea `config.json` y `logic.js` manualmente

### 3.3 Editar configuración del bot

Usa Render Shell o edita directamente en el servidor:

```json
{
  "name": "Tu Cliente",
  "verify_token": "verify_token_seguro",
  "phone_id": "TU_PHONE_ID",
  "token": "TU_TOKEN",
  "logic_file": "logic.js"
}
```

## Paso 4: Configurar webhook en Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Tu App → WhatsApp → Configuration
3. En "Webhook":
   - **Callback URL**: `https://multi-whatsapp-bot.onrender.com/webhook`
   - **Verify token**: El `verify_token` de tu `config.json`
4. Haz clic en "Verify and Save"

## Paso 5: Recargar bots después de cambios

Si editas un `config.json` o `logic.js`, recarga los bots:

```bash
curl https://multi-whatsapp-bot.onrender.com/reload-bots
```

O desde el navegador:
```
https://multi-whatsapp-bot.onrender.com/reload-bots
```

## 🔒 Seguridad

### Importante:

1. **Nunca subas tokens reales a GitHub**
   - Los `config.json` con tokens están en `.gitignore`
   - Solo `example-bot/config.json` se sube (con valores de ejemplo)

2. **Usa variables de entorno para secretos**
   - Considera mover tokens a variables de entorno de Render
   - O usa un servicio de secretos (Vault, AWS Secrets Manager)

3. **Restringe acceso al endpoint `/reload-bots`**
   - En producción, agrega autenticación
   - O elimina el endpoint y reinicia el servicio cuando cambies bots

## 📝 Notas adicionales

- **Plan Free de Render**: El servicio se "duerme" después de 15 min de inactividad. La primera petición puede tardar ~30 segundos en despertar.
- **Para producción real**: Considera un plan pago o usar otro servicio (Railway, Fly.io, AWS, etc.)
- **Logs**: Ve los logs en tiempo real en Render Dashboard → Logs

## 🐛 Solución de problemas

### El servicio no inicia
- Verifica los logs en Render Dashboard
- Asegúrate de que `package.json` tenga el script `start` correcto

### El webhook no funciona
- Verifica que la URL sea accesible públicamente
- Revisa que el `verify_token` coincida exactamente
- Verifica los logs del servicio en Render

### Los bots no se cargan
- Verifica que las carpetas `bots/` existan
- Revisa que los `config.json` tengan formato JSON válido
- Revisa los logs para errores específicos


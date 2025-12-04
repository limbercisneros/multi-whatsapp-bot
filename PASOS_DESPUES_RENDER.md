# ✅ Pasos después de desplegar en Render

## 1. Verificar que el servicio está funcionando

### Obtén tu URL de Render
En el Dashboard de Render, copia la URL de tu servicio (ej: `https://multi-whatsapp-bot.onrender.com`)

### Verifica el health check
Abre en tu navegador o ejecuta:
```bash
curl https://TU-URL.onrender.com/health
```

Deberías ver: `{"ok":true}`

### Verifica que los bots se cargan
```bash
curl https://TU-URL.onrender.com/reload-bots
```

Deberías ver: `{"ok":true,"count":1}` (o más si hay bots)

## 2. Crear tu primer bot en producción

### Opción A: Usar Render Shell (Recomendado)

1. En Render Dashboard → Tu servicio → Haz clic en **"Shell"**
2. Ejecuta:
```bash
npm run create-bot "Mi Primer Cliente" --slug=mi-primer-cliente
```

3. Edita el archivo `config.json`:
```bash
cd bots/mi-primer-cliente
nano config.json
# o usa el editor que prefieras
```

4. Agrega tus credenciales reales:
```json
{
  "name": "Mi Primer Cliente",
  "verify_token": "verify_ay9aik1s",
  "phone_id": "TU_PHONE_ID_AQUI",
  "token": "TU_TOKEN_AQUI",
  "logic_file": "logic.js"
}
```

5. Recarga los bots:
```bash
curl https://TU-URL.onrender.com/reload-bots
```

### Opción B: Crear manualmente

1. En Render Shell:
```bash
mkdir -p bots/mi-cliente
cd bots/mi-cliente
```

2. Crea `config.json`:
```bash
cat > config.json << 'EOF'
{
  "name": "Mi Cliente",
  "verify_token": "verify_token_seguro_123",
  "phone_id": "TU_PHONE_ID",
  "token": "TU_TOKEN",
  "logic_file": "logic.js"
}
EOF
```

3. Crea `logic.js` (copia desde example-bot):
```bash
cp ../example-bot/logic.js .
```

4. Recarga los bots:
```bash
curl https://TU-URL.onrender.com/reload-bots
```

## 3. Obtener credenciales de Facebook/WhatsApp

### Si ya tienes una App de Facebook:

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Selecciona tu App
3. Ve a **WhatsApp** → **API Setup**
4. Copia:
   - **Phone number ID** → Este es tu `phone_id`
   - **Temporary access token** o **Permanent token** → Este es tu `token`

### Si necesitas crear una App:

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. **My Apps** → **Create App**
3. Selecciona **Business** como tipo
4. Completa el formulario
5. Agrega el producto **WhatsApp**
6. Sigue las instrucciones para configurar WhatsApp
7. Obtén tu `phone_id` y `token`

## 4. Configurar el webhook en Facebook

1. En Facebook Developers → Tu App → **WhatsApp** → **Configuration**
2. En la sección **"Webhook"**, haz clic en **"Edit"**
3. Ingresa:
   - **Callback URL**: `https://TU-URL.onrender.com/webhook`
   - **Verify token**: El `verify_token` de tu `config.json` (ej: `verify_ay9aik1s`)
4. Haz clic en **"Verify and Save"**
5. Si todo está bien, verás un check verde ✅

### Suscribir a eventos:

1. Después de verificar, haz clic en **"Manage"** junto al webhook
2. Selecciona los eventos que quieres recibir:
   - ✅ **messages** (obligatorio)
   - ✅ **message_deliveries** (opcional)
   - ✅ **message_reads** (opcional)
3. Haz clic en **"Save"**

## 5. Probar el bot

### Enviar un mensaje de prueba:

1. Envía un mensaje de WhatsApp al número configurado en Facebook
2. Prueba los comandos:
   - `hola` → Debería responder con saludo
   - `menu` → Debería mostrar el menú
   - Cualquier otro texto → Mensaje de ayuda

### Ver logs en tiempo real:

1. En Render Dashboard → Tu servicio → **Logs**
2. Verás los mensajes entrantes y las respuestas del bot

## 6. Personalizar la lógica del bot

Edita `bots/mi-cliente/logic.js` en Render Shell:

```bash
cd bots/mi-cliente
nano logic.js
```

Ejemplo de lógica personalizada:
```javascript
module.exports = async (message, whatsappService, config) => {
  const txt = (message.text || '').trim().toLowerCase();

  if (txt === 'hola' || txt === 'hi') {
    await whatsappService.sendText(message.from, 
      `¡Hola! 👋 Bienvenido a ${config.name}. ¿En qué puedo ayudarte?`
    );
    return;
  }

  if (txt === 'menu' || txt === 'menú') {
    await whatsappService.sendText(message.from, 
      '🍽️ Nuestro menú:\n\n' +
      '1️⃣ Producto A - $10\n' +
      '2️⃣ Producto B - $20\n' +
      '3️⃣ Producto C - $30\n\n' +
      'Responde con el número para más info.'
    );
    return;
  }

  if (txt === '1' || txt === 'producto a') {
    await whatsappService.sendText(message.from, 
      '📦 Producto A\n\n' +
      'Descripción del producto...\n' +
      'Precio: $10\n\n' +
      '¿Quieres ordenar? Responde *si*'
    );
    return;
  }

  // Respuesta por defecto
  await whatsappService.sendText(message.from, 
    'No entendí tu mensaje. Prueba con:\n' +
    '• *hola* - Para saludar\n' +
    '• *menu* - Para ver el menú'
  );
};
```

Después de editar, recarga los bots:
```bash
curl https://TU-URL.onrender.com/reload-bots
```

## 7. Agregar más bots

Para agregar más clientes, simplemente crea más bots:

```bash
npm run create-bot "Cliente 2" --slug=cliente-2
npm run create-bot "Cliente 3" --slug=cliente-3
```

Cada bot necesita:
- Su propio `phone_id` y `token` de Facebook
- Su propio `verify_token` único
- Su propia lógica en `logic.js`

**Importante**: Facebook permite múltiples números de teléfono en la misma App, así que puedes usar la misma App de Facebook para varios bots, solo cambia el `phone_id` en cada `config.json`.

## 🔒 Seguridad y mejores prácticas

### ✅ Hacer:
- Usar `verify_token` únicos y seguros para cada bot
- Guardar tokens en variables de entorno (para producción avanzada)
- Revisar logs regularmente
- Probar el bot antes de ponerlo en producción

### ❌ No hacer:
- Compartir tokens públicamente
- Usar el mismo `verify_token` para múltiples bots
- Subir `config.json` con tokens reales a Git

## 🐛 Solución de problemas

### El webhook no se verifica
- Verifica que la URL sea accesible: `curl https://TU-URL.onrender.com/health`
- Asegúrate de que el `verify_token` coincida EXACTAMENTE (mayúsculas/minúsculas)
- Revisa los logs en Render para ver errores

### Los mensajes no llegan
- Verifica que el webhook esté suscrito a eventos "messages"
- Revisa que el `phone_id` y `token` sean correctos
- Verifica que el número de teléfono esté verificado en Facebook
- Revisa los logs en Render

### El bot no responde
- Verifica que el bot esté cargado: `curl https://TU-URL.onrender.com/reload-bots`
- Revisa los logs en Render para ver errores en la lógica
- Asegúrate de que `logic.js` exporte una función correctamente

### El servicio se "duerme" (Plan Free)
- El plan free de Render duerme el servicio después de 15 min de inactividad
- La primera petición puede tardar ~30 segundos en despertar
- Para producción real, considera un plan pago o usar otro servicio

## 📊 Monitoreo

### Ver estadísticas:
- Render Dashboard → Tu servicio → **Metrics**
- Ver CPU, memoria, requests, etc.

### Ver logs:
- Render Dashboard → Tu servicio → **Logs**
- Filtra por nivel (Info, Warning, Error)

## 🎉 ¡Listo!

Tu Multi-WhatsApp-Bot SaaS está funcionando. Ahora puedes:
- Agregar más bots
- Personalizar la lógica de cada uno
- Integrar con bases de datos
- Agregar un panel admin (próximo paso sugerido)


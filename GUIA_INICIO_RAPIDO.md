# 🚀 Guía de Inicio Rápido - Multi-WhatsApp-Bot

## Paso 1: Instalar dependencias

```bash
npm install
```

## Paso 2: Configurar un bot con tus credenciales reales

### Opción A: Editar el bot de ejemplo

Edita el archivo `bots/example-bot/config.json` y reemplaza:

```json
{
  "name": "Restaurante Pepe",
  "verify_token": "verify_demo123",
  "phone_id": "TU_PHONE_ID_AQUI",        // ← Reemplaza con tu Phone ID real
  "token": "TU_TOKEN_AQUI",              // ← Reemplaza con tu Token real
  "logic_file": "logic.js"
}
```

### Opción B: Crear un nuevo bot

```bash
npm run create-bot "Nombre de tu Bot" --slug=mi-bot
```

Luego edita `bots/mi-bot/config.json` y agrega tu `phone_id` y `token`.

## Paso 3: Obtener credenciales de Facebook/WhatsApp

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una App o selecciona una existente
3. Agrega el producto **WhatsApp**
4. En la sección de WhatsApp, encontrarás:
   - **Phone number ID**: Este es tu `phone_id`
   - **Access Token**: Este es tu `token` (temporal o permanente)

## Paso 4: Iniciar el servidor

### Desarrollo (con auto-reload):
```bash
npm run dev
```

### Producción:
```bash
npm start
```

Deberías ver:
```
Servidor Multi-Bot escuchando en puerto 3000
```

## Paso 5: Configurar el webhook en Facebook

1. En Facebook Developers, ve a tu App → WhatsApp → Configuration
2. En "Webhook", haz clic en "Edit"
3. Ingresa tu URL de webhook:
   - **Local/Testing**: Usa [ngrok](https://ngrok.com/) para exponer tu localhost:
     ```bash
     ngrok http 3000
     ```
     Copia la URL HTTPS que te da (ej: `https://abc123.ngrok.io`)
   - **Producción**: Tu dominio real (ej: `https://tudominio.com`)
4. En "Verify token", ingresa el `verify_token` del bot que configuraste (ej: `verify_demo123`)
5. Haz clic en "Verify and Save"

## Paso 6: Probar el bot

1. Envía un mensaje de WhatsApp al número configurado
2. Prueba los comandos:
   - `hola` → Debería responder con saludo
   - `menu` → Debería mostrar el menú
   - Cualquier otro texto → Mensaje de ayuda

## 🔧 Comandos útiles

### Recargar bots sin reiniciar el servidor:
```bash
curl http://localhost:3000/reload-bots
```

### Verificar que el servidor está funcionando:
```bash
curl http://localhost:3000/health
```

### Ver todos los bots cargados:
Abre `http://localhost:3000/reload-bots` en el navegador (devolverá el conteo de bots)

## 🐛 Solución de problemas

### El servidor no inicia
- Verifica que el puerto 3000 no esté en uso
- Revisa que todas las dependencias estén instaladas: `npm install`

### El webhook no se verifica
- Asegúrate de que el `verify_token` en Facebook coincida exactamente con el de `config.json`
- Verifica que tu servidor esté accesible públicamente (usa ngrok para testing local)
- Revisa los logs del servidor para ver errores

### Los mensajes no llegan
- Verifica que el `phone_id` y `token` sean correctos
- Asegúrate de que el webhook esté configurado correctamente
- Revisa que el número de teléfono esté verificado en Facebook

### Error al cargar un bot
- Verifica que `config.json` tenga formato JSON válido
- Asegúrate de que `logic.js` exista y exporte una función
- Revisa la consola para ver errores específicos

## 📝 Próximos pasos

1. Personaliza la lógica en `bots/tu-bot/logic.js`
2. Agrega más comandos y respuestas
3. Integra con bases de datos si necesitas persistencia
4. Despliega en producción (Docker, PM2, etc.)


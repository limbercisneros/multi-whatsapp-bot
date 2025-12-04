# Multi-WhatsApp-Bot SaaS

Sistema SaaS que aloja **múltiples bots de WhatsApp** en un solo servidor. Cada cliente tiene su propia configuración y lógica de bot en carpetas separadas.

## 🚀 Características

- ✅ Backend Node.js + Express
- ✅ Multi-bot: cada cliente tiene `bots/<slug>/config.json` + `logic.js`
- ✅ Webhooks únicos: `/webhook` maneja todas las entradas y enruta por `phone_id`
- ✅ Generator CLI: `npm run create-bot "Nombre Cliente" --slug=cliente-slug` crea la carpeta con plantilla
- ✅ Docker + docker-compose (Postgres opcional) para producción
- ✅ Scripts y ejemplo de despliegue con PM2 o Docker

## 📋 Requisitos previos

* Node.js 18+ y npm
* Git
* Docker (opcional, recomendado)
* Cuenta Facebook Business, número de WhatsApp y acceso a WhatsApp Cloud API

## 🏗️ Estructura del proyecto

```
multi-whatsapp-bot/
│
├── app.js
├── package.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
│
├── controllers/
│   └── webhookController.js
│
├── services/
│   ├── botManager.js
│   ├── messageRouter.js
│   ├── whatsappServiceFactory.js
│   └── botGenerator.js
│
├── bots/                 # Carpeta con un subdirectorio por cliente
│   └── example-bot/
│       ├── config.json
│       └── logic.js
│
└── README.md
```

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <tu-repo>
cd multi-whatsapp-bot
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de entorno:
```bash
cp .env.example .env
```

4. Edita `.env` con tus configuraciones.

## 📝 Uso

### Crear un nuevo bot

```bash
npm run create-bot "Restaurante Pepe" --slug=restaurante-pepe
```

Esto creará:
- `bots/restaurante-pepe/config.json` (con `verify_token` generado)
- `bots/restaurante-pepe/logic.js` (plantilla básica)

Luego edita `bots/restaurante-pepe/config.json` y agrega:
- `phone_id`: ID del número de teléfono de WhatsApp
- `token`: Token de acceso de Facebook Graph API

### Iniciar en desarrollo

```bash
npm run dev
```

### Iniciar en producción

```bash
npm start
```

### Recargar bots (sin reiniciar el servidor)

```bash
curl http://localhost:3000/reload-bots
```

### Verificar estado

```bash
curl http://localhost:3000/health
```

## 🐳 Docker

### Construir y ejecutar con Docker Compose

```bash
docker-compose up -d
```

### Solo construir la imagen

```bash
docker build -t multi-whatsapp-bot .
```

### Ejecutar contenedor

```bash
docker run -p 3000:3000 multi-whatsapp-bot
```

## 🔗 Configuración de Webhook en Facebook Developers

1. En Facebook Developers, crea tu App y añade producto **WhatsApp** (Cloud API).
2. En la sección de Webhooks, añade `https://tu-dominio.com/webhook`.
3. Cuando Facebook pida `hub.verify_token`, pega el `verify_token` del `config.json` del bot correspondiente.

> **Nota importante**: Facebook sólo permite registrar un endpoint por App, pero puedes verificarlo con el `hub.verify_token` que envías en la pantalla de verificación. Para verificar múltiples bots bajo la misma App, normalmente usarás el mismo endpoint pero con `hub.verify_token` cambiable.

## 🔄 Cómo funciona el ruteo

1. Facebook envía mensajes a `https://tu-dominio.com/webhook`.
2. El `webhookController.receiveMessage` extrae `phone_number_id` del payload para identificar qué bot recibe el mensaje.
3. `botManager` devuelve la lógica y token del bot.
4. `messageRouter` normaliza el mensaje y ejecuta la función `logic(payload, whatsappService, config)` del bot.

## 📦 Ejemplo de lógica de bot

Cada bot tiene su `logic.js` que exporta una función async:

```javascript
module.exports = async (message, whatsappService, config) => {
  const txt = (message.text || '').trim().toLowerCase();

  if (txt === 'hola') {
    await whatsappService.sendText(message.from, 'Hola! Soy el bot de ' + config.name);
    return;
  }

  // Tu lógica personalizada aquí
};
```

### Enviar botones interactivos

```javascript
await whatsappService.sendTemplate(message.from, {
  messaging_product: 'whatsapp',
  to: message.from,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: { text: 'Elige una opción' },
    action: { 
      buttons: [
        { type: 'reply', reply: { id: 'op1', title: 'Opción 1' } }
      ] 
    }
  }
});
```

## 🔒 Seguridad y buenas prácticas

* Nunca guardes tokens en repositorios públicos.
* Usa `config.json` con permisos restringidos en servidor.
* Considera almacenar tokens en secretos (Vault) para producción.
* Valida entradas (payload) y maneja errores para no caer en loops.
* Implementa rate limiting si envías muchos mensajes.

## 📊 Monitorización y logging

* Agrega logs por bot (`logs/<bot-slug>.log`) o integra servicios externos (Sentry, Datadog).
* Añade endpoint `/health` y `/metrics` (Prometheus) si necesitas métricas.

## 🚀 Extensiones sugeridas

1. **Panel admin** (React) para crear bots, editar `config.json`, ver logs y estadísticas
2. **Autoprovisionador** que pide token y phone_id al cliente y guarda la configuración en la DB
3. **Integración con Stripe/MercadoPago** para facturación automática
4. **Integración con OpenAI** para respuestas con IA
5. **Módulo de plantillas y scripts compartidos** para reutilizar flujos

## 📄 Licencia

Este proyecto es una plantilla base pensada para producción con ajustes mínimos. Requiere probar con tu cuenta de WhatsApp Cloud API y revisar límites y políticas de mensajes salientes de WhatsApp.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.


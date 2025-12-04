const whatsappServiceFactory = require('./whatsappServiceFactory');

// message: objeto message de WhatsApp Cloud API
// botRecord: { config, logic }

async function routeMessage(botRecord, message) {
  try {
    if (!botRecord) {
      console.warn('[Router] ⚠️  Bot no encontrado para mensaje from=', message.from);
      return;
    }

    const { config, logic } = botRecord;

    // Validar que tenga token y phone_id
    if (!config.token || !config.phone_id) {
      console.error('[Router] ❌ Bot', config.name, 'no tiene token o phone_id configurado');
      return;
    }

    // Crea servicio para enviar mensajes usando token y phoneId del bot
    const whatsappService = whatsappServiceFactory(config.token, config.phone_id);

    // Normalizar texto simple
    const text = message?.text?.body || (message?.type === 'interactive' ? JSON.stringify(message.interactive) : '');

    const payload = {
      from: message.from,
      id: message.id || null,
      text,
      raw: message
    };

    console.log('[Router] 🔄 Ejecutando lógica del bot:', config.name);
    // Ejecutar la lógica del bot (module.exports = async (message, whatsappService, config) => { ... })
    await logic(payload, whatsappService, config);
    console.log('[Router] ✅ Lógica ejecutada exitosamente para:', config.name);
  } catch (err) {
    console.error('[Router] ❌ Error en routeMessage:', err);
    console.error('[Router] Stack:', err.stack);
  }
}

module.exports = { routeMessage };


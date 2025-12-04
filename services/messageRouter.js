const whatsappServiceFactory = require('./whatsappServiceFactory');

// message: objeto message de WhatsApp Cloud API
// botRecord: { config, logic }

async function routeMessage(botRecord, message) {
  try {
    if (!botRecord) {
      console.warn('Bot no encontrado para mensaje from=', message.from);
      return;
    }

    const { config, logic } = botRecord;

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

    // Ejecutar la lógica del bot (module.exports = async (message, whatsappService, config) => { ... })
    await logic(payload, whatsappService, config);
  } catch (err) {
    console.error('Error en routeMessage:', err);
  }
}

module.exports = { routeMessage };


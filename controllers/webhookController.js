const { routeMessage } = require('../services/messageRouter');
const { getBotByVerifyToken, getBotByPhoneId } = require('../services/botManager');

exports.verifyWebhook = (req, res) => {
  // Facebook envía: hub.mode, hub.verify_token, hub.challenge
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('[Webhook] Verificación recibida:', { mode, token: token ? '***' : 'missing', challenge: challenge ? 'present' : 'missing' });

  if (mode === 'subscribe') {
    const bot = getBotByVerifyToken(token);
    if (bot) {
      console.log('[Webhook] ✅ Verificación exitosa para bot:', bot.config.name);
      return res.status(200).send(challenge);
    } else {
      console.log('[Webhook] ❌ Token no encontrado:', token);
    }
  }

  return res.sendStatus(403);
};

exports.receiveMessage = async (req, res) => {
  try {
    const body = req.body;

    // Validamos estructura básica
    if (!body.entry) {
      console.log('[Webhook] ❌ Request sin entry');
      return res.sendStatus(400);
    }

    // Puede venir con múltiples entradas: iterar
    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        const metadata = value?.metadata || {};

        // Intentamos determinar el bot: preferimos phone_number_id -> buscar bot por phone_id
        const phoneId = value?.metadata?.phone_number_id || metadata.phone_number_id || metadata.display_phone_number;
        let bot = null;
        if (phoneId) {
          bot = getBotByPhoneId(String(phoneId));
          if (bot) {
            console.log('[Webhook] ✅ Bot encontrado por phone_id:', phoneId, '->', bot.config.name);
          } else {
            console.log('[Webhook] ⚠️  Bot NO encontrado para phone_id:', phoneId);
          }
        } else {
          console.log('[Webhook] ⚠️  No se encontró phone_id en el payload');
        }

        const messages = value?.messages || [];
        if (messages.length === 0) {
          console.log('[Webhook] ℹ️  No hay mensajes en este cambio (puede ser status update)');
          continue;
        }

        for (const message of messages) {
          console.log('[Webhook] 📨 Mensaje recibido:', {
            from: message.from,
            type: message.type,
            text: message.text?.body?.substring(0, 50) || 'N/A',
            bot: bot ? bot.config.name : 'NO ENCONTRADO'
          });
          // Cada message tiene 'from', 'text', 'type', etc.
          await routeMessage(bot, message);
        }
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('[Webhook] ❌ Error receiveMessage:', err);
    return res.sendStatus(500);
  }
};


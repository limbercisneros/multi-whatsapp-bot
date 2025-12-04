const { routeMessage } = require('../services/messageRouter');
const { getBotByVerifyToken, getBotByPhoneId } = require('../services/botManager');

exports.verifyWebhook = (req, res) => {
  // Facebook envía: hub.mode, hub.verify_token, hub.challenge
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe') {
    const bot = getBotByVerifyToken(token);
    if (bot) return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

exports.receiveMessage = async (req, res) => {
  try {
    const body = req.body;

    // Validamos estructura básica
    if (!body.entry) return res.sendStatus(400);

    // Puede venir con múltiples entradas: iterar
    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        const metadata = value?.metadata || {};

        // Intentamos determinar el bot: preferimos phone_number_id -> buscar bot por phone_id
        const phoneId = value?.metadata?.phone_number_id || metadata.phone_number_id || metadata.display_phone_number;
        let bot = null;
        if (phoneId) bot = getBotByPhoneId(String(phoneId));

        // Si no encontramos por phoneId, intentamos por mapping en la metadata (fallback)
        if (!bot) {
          // En este diseño asumimos que el webhook verification usa verify_token; el POST no lo manda, así que es mejor mapear por phone_id.
        }

        const messages = value?.messages || [];
        for (const message of messages) {
          // Cada message tiene 'from', 'text', 'type', etc.
          await routeMessage(bot, message);
        }
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('Error receiveMessage:', err);
    return res.sendStatus(500);
  }
};


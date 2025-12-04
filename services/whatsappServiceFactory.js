const axios = require('axios');

module.exports = (token, phoneId) => {
  const baseUrl = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  return {
    sendText: async (to, body) => {
      try {
        const response = await axios.post(baseUrl, {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[WhatsApp] ✅ Mensaje enviado a', to, 'ID:', response.data.messages?.[0]?.id);
        return response.data;
      } catch (err) {
        console.error('[WhatsApp] ❌ Error sendText:', err.response?.data || err.message);
        if (err.response?.data) {
          console.error('[WhatsApp] Detalles:', JSON.stringify(err.response.data, null, 2));
        }
        throw err;
      }
    },

    sendTemplate: async (to, template) => {
      try {
        const response = await axios.post(baseUrl, template, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[WhatsApp] ✅ Template enviado a', to, 'ID:', response.data.messages?.[0]?.id);
        return response.data;
      } catch (err) {
        console.error('[WhatsApp] ❌ Error sendTemplate:', err.response?.data || err.message);
        if (err.response?.data) {
          console.error('[WhatsApp] Detalles:', JSON.stringify(err.response.data, null, 2));
        }
        throw err;
      }
    }
  };
};


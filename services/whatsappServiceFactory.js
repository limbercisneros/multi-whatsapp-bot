const axios = require('axios');

module.exports = (token, phoneId) => {
  const baseUrl = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  return {
    sendText: async (to, body) => {
      try {
        await axios.post(baseUrl, {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error sendText:', err.response?.data || err.message);
      }
    },

    sendTemplate: async (to, template) => {
      try {
        await axios.post(baseUrl, template, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error sendTemplate:', err.response?.data || err.message);
      }
    }
  };
};


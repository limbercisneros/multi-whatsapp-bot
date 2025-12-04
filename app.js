require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('./controllers/webhookController');
const { loadBots, reloadBots } = require('./services/botManager');

const app = express();
app.use(bodyParser.json());

// Cargar bots inicialmente
global.bots = loadBots();

// Endpoints
app.get('/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

app.get('/reload-bots', (req, res) => {
  global.bots = reloadBots();
  const botCount = Object.keys(global.bots).filter(k => !k.startsWith('phone:')).length;
  res.json({ ok: true, count: botCount, timestamp: new Date().toISOString() });
});

// Endpoint de diagnóstico (útil para debugging)
app.get('/bots', (req, res) => {
  const bots = Object.keys(global.bots)
    .filter(k => !k.startsWith('phone:'))
    .map(token => {
      const bot = global.bots[token];
      return {
        name: bot.config.name,
        verify_token: bot.config.verify_token,
        phone_id: bot.config.phone_id || 'NO CONFIGURADO',
        has_token: !!bot.config.token,
        has_phone_id: !!bot.config.phone_id
      };
    });
  res.json({ bots, count: bots.length });
});

app.get('/webhook', webhookController.verifyWebhook);
app.post('/webhook', webhookController.receiveMessage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor Multi-Bot escuchando en puerto ${PORT}`);
  console.log(`📊 Bots cargados: ${Object.keys(global.bots).filter(k => !k.startsWith('phone:')).length}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Lista de bots: http://localhost:${PORT}/bots`);
  console.log(`🔄 Recargar bots: http://localhost:${PORT}/reload-bots`);
  console.log('='.repeat(50));
});


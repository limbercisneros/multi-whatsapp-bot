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
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/reload-bots', (req, res) => {
  global.bots = reloadBots();
  res.json({ ok: true, count: Object.keys(global.bots).length });
});

app.get('/webhook', webhookController.verifyWebhook);
app.post('/webhook', webhookController.receiveMessage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Multi-Bot escuchando en puerto ${PORT}`));


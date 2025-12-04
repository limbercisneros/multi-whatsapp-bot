const fs = require('fs');
const path = require('path');

const BOTS_PATH = path.join(__dirname, '../bots');

let botsCache = {};

function loadBots() {
  const result = {};
  if (!fs.existsSync(BOTS_PATH)) fs.mkdirSync(BOTS_PATH);

  const folders = fs.readdirSync(BOTS_PATH);
  for (const folder of folders) {
    const cfgPath = path.join(BOTS_PATH, folder, 'config.json');
    if (!fs.existsSync(cfgPath)) continue;

    try {
      const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      const logicPath = path.join(BOTS_PATH, folder, config.logic_file || 'logic.js');

      // Cargar la lógica con require. Se necesita eliminar cache para recargar dinámicamente
      delete require.cache[require.resolve(logicPath)];
      const logic = require(logicPath);

      // Guardar con claves por verify_token y por phone_id si existen
      result[config.verify_token] = { config, logic };
      if (config.phone_id) result['phone:' + String(config.phone_id)] = { config, logic };
    } catch (err) {
      console.error('Error cargando bot', folder, err);
    }
  }

  botsCache = result;
  return result;
}

function reloadBots() {
  return loadBots();
}

function getBotByVerifyToken(token) {
  return botsCache[token] || null;
}

function getBotByPhoneId(phoneId) {
  return botsCache['phone:' + String(phoneId)] || null;
}

module.exports = {
  loadBots,
  reloadBots,
  getBotByVerifyToken,
  getBotByPhoneId
};


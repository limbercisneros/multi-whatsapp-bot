const fs = require('fs');
const path = require('path');

const BOTS_PATH = path.join(__dirname, '../bots');

let botsCache = {};

function loadBots() {
  const result = {};
  if (!fs.existsSync(BOTS_PATH)) {
    console.log('[BotManager] 📁 Creando carpeta bots');
    fs.mkdirSync(BOTS_PATH, { recursive: true });
  }

  const folders = fs.readdirSync(BOTS_PATH);
  console.log('[BotManager] 📂 Carpetas encontradas:', folders.length);

  for (const folder of folders) {
    const cfgPath = path.join(BOTS_PATH, folder, 'config.json');
    if (!fs.existsSync(cfgPath)) {
      console.log('[BotManager] ⚠️  No hay config.json en:', folder);
      continue;
    }

    try {
      const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      const logicPath = path.join(BOTS_PATH, folder, config.logic_file || 'logic.js');

      if (!fs.existsSync(logicPath)) {
        console.error('[BotManager] ❌ No existe logic.js en:', folder);
        continue;
      }

      // Cargar la lógica con require. Se necesita eliminar cache para recargar dinámicamente
      delete require.cache[require.resolve(logicPath)];
      const logic = require(logicPath);

      // Validar que sea una función
      if (typeof logic !== 'function') {
        console.error('[BotManager] ❌ logic.js en', folder, 'no exporta una función');
        continue;
      }

      // Guardar con claves por verify_token y por phone_id si existen
      result[config.verify_token] = { config, logic };
      if (config.phone_id) {
        result['phone:' + String(config.phone_id)] = { config, logic };
        console.log('[BotManager] ✅ Bot cargado:', config.name, '(verify_token:', config.verify_token, ', phone_id:', config.phone_id, ')');
      } else {
        console.log('[BotManager] ⚠️  Bot cargado sin phone_id:', config.name, '(verify_token:', config.verify_token, ')');
      }
    } catch (err) {
      console.error('[BotManager] ❌ Error cargando bot', folder, ':', err.message);
    }
  }

  botsCache = result;
  console.log('[BotManager] 📊 Total bots cargados:', Object.keys(result).filter(k => !k.startsWith('phone:')).length);
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


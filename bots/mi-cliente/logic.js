module.exports = async (message, whatsappService, config) => {
  const txt = (message.text || '').trim().toLowerCase();

  if (txt === 'hola') {
    await whatsappService.sendText(message.from, 'Hola! Soy el bot de ' + config.name);
    return;
  }

  if (txt === 'menu') {
    await whatsappService.sendText(message.from, 'Menú: 1) Producto A - $10 2) Producto B - $20');
    return;
  }

  await whatsappService.sendText(message.from, 'No entendí, prueba con *hola* o *menu*.');
};
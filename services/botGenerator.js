#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const args = process.argv.slice(2);
const name = args[0] || 'Nuevo Cliente';
const slugArg = args.find(a => a.startsWith('--slug='));
const slug = slugArg ? slugArg.split('=')[1] : slugify(name, { lower: true, strict: true });

const BOTS_PATH = path.join(__dirname, '../bots');
if (!fs.existsSync(BOTS_PATH)) fs.mkdirSync(BOTS_PATH);

const target = path.join(BOTS_PATH, slug);
if (fs.existsSync(target)) {
  console.error('Ya existe un bot con ese slug:', slug);
  process.exit(1);
}

fs.mkdirSync(target);

const config = {
  name: name,
  verify_token: 'verify_' + Math.random().toString(36).slice(2, 10),
  phone_id: '',
  token: '',
  logic_file: 'logic.js'
};

fs.writeFileSync(path.join(target, 'config.json'), JSON.stringify(config, null, 2));

const logicTemplate = `module.exports = async (message, whatsappService, config) => {
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
};`;

fs.writeFileSync(path.join(target, 'logic.js'), logicTemplate);

console.log('Bot creado en:', target);
console.log('Edita bots/' + slug + '/config.json y agrega phone_id y token');


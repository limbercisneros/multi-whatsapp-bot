#!/usr/bin/env node
/**
 * Script de verificación para diagnosticar problemas de configuración
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del Multi-WhatsApp-Bot...\n');

// 1. Verificar estructura de carpetas
console.log('📁 Verificando estructura de carpetas...');
const requiredDirs = ['controllers', 'services', 'bots'];
let allDirsOk = true;

for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}/ existe`);
  } else {
    console.log(`  ❌ ${dir}/ NO existe`);
    allDirsOk = false;
  }
}

// 2. Verificar archivos principales
console.log('\n📄 Verificando archivos principales...');
const requiredFiles = [
  'app.js',
  'package.json',
  'controllers/webhookController.js',
  'services/botManager.js',
  'services/messageRouter.js',
  'services/whatsappServiceFactory.js'
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} existe`);
  } else {
    console.log(`  ❌ ${file} NO existe`);
    allDirsOk = false;
  }
}

// 3. Verificar bots
console.log('\n🤖 Verificando bots...');
const botsPath = path.join(__dirname, '..', 'bots');
if (fs.existsSync(botsPath)) {
  const botFolders = fs.readdirSync(botsPath).filter(f => {
    const fullPath = path.join(botsPath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`  📂 Carpetas de bots encontradas: ${botFolders.length}`);

  for (const folder of botFolders) {
    const configPath = path.join(botsPath, folder, 'config.json');
    const logicPath = path.join(botsPath, folder, 'logic.js');

    console.log(`\n  Bot: ${folder}`);
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(`    ✅ config.json válido`);
        console.log(`    📝 Nombre: ${config.name}`);
        console.log(`    🔑 Verify token: ${config.verify_token ? '✅ Configurado' : '❌ FALTA'}`);
        console.log(`    📱 Phone ID: ${config.phone_id ? '✅ ' + config.phone_id : '❌ NO CONFIGURADO'}`);
        console.log(`    🔐 Token: ${config.token ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
      } catch (err) {
        console.log(`    ❌ Error leyendo config.json: ${err.message}`);
      }
    } else {
      console.log(`    ❌ config.json NO existe`);
    }

    if (fs.existsSync(logicPath)) {
      console.log(`    ✅ logic.js existe`);
    } else {
      console.log(`    ❌ logic.js NO existe`);
    }
  }
} else {
  console.log('  ⚠️  Carpeta bots/ no existe');
}

// 4. Verificar package.json
console.log('\n📦 Verificando dependencias...');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = ['express', 'axios', 'dotenv', 'body-parser', 'slugify'];
  
  for (const dep of requiredDeps) {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`  ✅ ${dep} está en dependencias`);
    } else {
      console.log(`  ⚠️  ${dep} NO está en dependencias`);
    }
  }
}

// 5. Verificar .env
console.log('\n🔐 Verificando variables de entorno...');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('  ✅ .env existe');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('PORT=')) {
    console.log('  ✅ PORT configurado');
  } else {
    console.log('  ⚠️  PORT no configurado (se usará 3000 por defecto)');
  }
} else {
  console.log('  ⚠️  .env NO existe (puede usar .env.example como referencia)');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Verificación completada');
console.log('='.repeat(50));
console.log('\n💡 Próximos pasos:');
console.log('  1. Configura phone_id y token en bots/*/config.json');
console.log('  2. Configura el webhook en Facebook Developers');
console.log('  3. Inicia el servidor: npm start');
console.log('  4. Verifica: curl http://localhost:3000/health\n');


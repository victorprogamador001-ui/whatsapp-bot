const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado!');
});

client.on('message', message => {
    if (message.body === 'oi') {
        message.reply('Olá! Eu sou um bot 🤖');
    }
});

client.initialize();

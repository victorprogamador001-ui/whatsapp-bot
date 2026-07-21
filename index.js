const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();

let qrCodeAtual = '';

const client = new Client({
    authStrategy: new LocalAuth(),

    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});


// Página para mostrar o QR Code
app.get('/', async (req, res) => {

    if (!qrCodeAtual) {
        return res.send(`
            <h1>🤖 Bot WhatsApp</h1>
            <p>Aguardando QR Code...</p>
        `);
    }

    const qrImagem = await QRCode.toDataURL(qrCodeAtual);

    res.send(`
        <html>
        <body style="text-align:center;font-family:Arial">

            <h1>🤖 WhatsApp Bot</h1>
            <h2>Escaneie o QR Code</h2>

            <img src="${qrImagem}" width="300"/>

        </body>
        </html>
    `);
});


// Inicia servidor do Railway
app.listen(process.env.PORT || 8080, () => {
    console.log('Servidor web iniciado!');
});


// Gera QR
client.on('qr', qr => {

    qrCodeAtual = qr;

    console.log('QR Code gerado!');
});


// Quando conectar
client.on('ready', () => {
    console.log('Bot conectado! 🤖');
});


// Mensagens
client.on('message', async message => {

    if (message.body === '!ping') {
        message.reply('Pong! 🤖');
    }

});


client.initialize();

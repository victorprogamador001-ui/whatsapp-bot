const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();

let qrCodeAtual = '';

const client = new Client({

    authStrategy: new LocalAuth({
        clientId: "knight-bot"
    }),

    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }

});


// Página QR
app.get('/', async (req, res) => {

    if (!qrCodeAtual) {

        return res.send(`
        <h1>🤖 Knight Bot</h1>
        <p>Aguardando QR Code ou conectado...</p>
        `);

    }

    const qrImagem = await QRCode.toDataURL(qrCodeAtual);

    res.send(`
    <html>
    <body style="text-align:center;font-family:Arial">

    <h1>🤖 Knight Bot</h1>
    <h2>Escaneie o QR Code</h2>

    <img src="${qrImagem}" width="300">

    </body>
    </html>
    `);

});


// Servidor Railway
app.listen(process.env.PORT || 8080, () => {

    console.log('Servidor web iniciado!');

});


// QR Code
client.on('qr', qr => {

    qrCodeAtual = qr;

    console.log('QR Code gerado!');

});


// Conectado
client.on('ready', () => {

    qrCodeAtual = '';

    console.log('Bot conectado! 🤖');

});


// Autenticado
client.on('authenticated', () => {

    console.log('Autenticado! ✅');

});


// Erro
client.on('auth_failure', msg => {

    console.log('Falha na autenticação:', msg);

});


// Desconectado
client.on('disconnected', reason => {

    console.log('Desconectado:', reason);

});


// Comandos
client.on('message', async message => {

    const texto = message.body.toLowerCase();


    if (texto === '!ping') {

        await message.reply('Pong! 🤖');

    }


    if (texto === '!menu') {

        await message.reply(`
🤖 *Knight Bot*

📌 Comandos:

!ping - Teste
!menu - Menu
!dono - Criador

⚔️ Bot online!
        `);

    }


    if (texto === '!dono') {

        await message.reply('👑 Criador: Victor 🤖');

    }


});


client.initialize();

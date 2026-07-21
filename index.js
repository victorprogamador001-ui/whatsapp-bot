const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');

const { mensagemGrupo } = require('./comandos/grupo');
const { isDono, isAdmin, isAutorizado } = require('./comandos/admin');

const app = express();

let qrCodeAtual = null;

app.get('/', (req, res) => {
    res.send('🤖 Bot WhatsApp online!');
});

app.get('/qr', async (req, res) => {
    if (!qrCodeAtual) {
        return res.send('QR Code ainda não foi gerado. Aguarde...');
    }

    const imagem = await qrcode.toDataURL(qrCodeAtual);

    res.send(`
        <html>
        <body style="text-align:center;font-family:Arial">
            <h2>Escaneie o QR Code</h2>
            <img src="${imagem}" />
        </body>
        </html>
    `);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor web iniciado!');
});


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});


client.on('qr', qr => {
    qrCodeAtual = qr;
    console.log('QR Code gerado!');
});


client.on('ready', () => {
    console.log('Bot conectado! 🤖');
});


client.on('message', async message => {

    const numero = message.author || message.from;


    const respostaGrupo = mensagemGrupo(message.body);

    if (respostaGrupo) {
        message.reply(respostaGrupo);
        return;
    }


    if (message.body === '!dono') {

        if (isDono(numero)) {
            message.reply('👑 Você é o dono do bot.');
        } else {
            message.reply('❌ Você não tem permissão.');
        }

        return;
    }


    if (message.body === '!status') {

        if (isAutorizado(numero)) {
            message.reply('✅ Você pode usar funções autorizadas.');
        } else {
            message.reply('❌ Acesso negado.');
        }

        return;
    }

});


client.initialize();

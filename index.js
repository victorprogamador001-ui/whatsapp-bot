const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { mensagemGrupo } = require('./comandos/grupo');
const { isDono, isAdmin, isAutorizado } = require('./comandos/admin');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-novo"
    }),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    }
});

client.on('qr', qr => {
    console.log('QR Code gerado!');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado! 🤖');
});

client.on('authenticated', () => {
    console.log('Autenticado com sucesso!');
});

client.on('auth_failure', msg => {
    console.log('Falha na autenticação:', msg);
});

client.on('disconnected', reason => {
    console.log('Bot desconectado:', reason);
});

client.on('message', async message => {

    const numero = message.author || message.from;

    const respostaGrupo = mensagemGrupo(message.body);

    if (respostaGrupo) {
        await message.reply(respostaGrupo);
        return;
    }

    if (message.body === '!dono') {

        if (isDono(numero)) {
            await message.reply('👑 Você é o dono do bot.');
        } else {
            await message.reply('❌ Você não tem permissão.');
        }

        return;
    }

    if (message.body === '!status') {

        if (isAutorizado(numero)) {
            await message.reply('✅ Você pode usar funções autorizadas.');
        } else {
            await message.reply('❌ Acesso negado.');
        }

        return;
    }

});

client.initialize();

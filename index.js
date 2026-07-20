const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { mensagemGrupo } = require('./comandos/grupo');
const { isDono, isAdmin, isAutorizado } = require('./comandos/admin');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado! 🤖');
});

client.on('message', async message => {

    const numero = message.author || message.from;

    // Comandos de grupo
    const respostaGrupo = mensagemGrupo(message.body);

    if (respostaGrupo) {
        message.reply(respostaGrupo);
        return;
    }


    // Comando apenas para donos
    if (message.body === '!dono') {

        if (isDono(numero)) {
            message.reply('👑 Você é o dono do bot.');
        } else {
            message.reply('❌ Você não tem permissão.');
        }

        return;
    }


    // Comando apenas para autorizados
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

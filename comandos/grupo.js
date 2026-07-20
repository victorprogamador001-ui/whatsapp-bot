function mensagemGrupo(mensagem) {

    if (mensagem === '!ping') {
        return '🏓 Bot online!';
    }

    if (mensagem === '!ajuda') {
        return `
🤖 Comandos do VictorBot:

!ping - Verifica se estou online
!ajuda - Mostra os comandos
        `;
    }

    return null;
}

module.exports = {
    mensagemGrupo
};

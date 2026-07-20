const config = require('../config');

function isDono(numero) {
    return numero === config.donoPrincipal ||
           numero === config.donoReserva;
}

function isAdmin(numero) {
    return isDono(numero) ||
           config.admins.includes(numero);
}

function isAutorizado(numero) {
    return isAdmin(numero) ||
           config.autorizados.includes(numero);
}

module.exports = {
    isDono,
    isAdmin,
    isAutorizado
};

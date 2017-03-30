var braintree = require('braintree');

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'xrwb8pdmj6qsg5pz',
    publicKey: 'trw8p35xtknmkb3b',
    privateKey: '61542f5ed4d49e2a8a0d43e4f748654b'
});

module.exports = gateway;
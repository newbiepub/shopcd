require('babel-register');
require('babel-polyfill');
const server = require('./app/app');

server.listen(8080, (err, res) => {
    return console.log(`Your App Running At: http://localhost:${8080}`)
});
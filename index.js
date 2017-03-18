require('babel-register');
require('babel-polyfill');
const server = require('./app/app');

server.listen(8080, "127.0.0.1",(err, res) => {
    return console.log(`Your App Running At: http://localhost:${8080}`)
});
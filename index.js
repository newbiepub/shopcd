require('babel-register');
require('babel-polyfill');
const server = require('./app/app');

server.listen(3000, "127.0.0.1",(err, res) => {
    return console.log(`Your App Running At: http://localhost:${3000}`)
});
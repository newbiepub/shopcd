const level = require('level');
const path = require('path');
const db = path.resolve(__dirname, '../db', "./db");
module.exports = level(db);
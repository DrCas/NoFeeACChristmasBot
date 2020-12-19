const Sequelize = require('sequelize');
const config = require('../config');
const logToFile = require('log-to-file');

const db = {}

const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    dialectOptions: {
        supportBigNumbers: true
    },
    operatorsAliases: 'false',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: msg => logToFile(msg, 'database.log')
});

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db;
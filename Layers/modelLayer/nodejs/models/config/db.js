'use strict';

let config = require('./env.json')['test'];

let Sequelize = require('sequelize');

let environment = process.env.KEY;

let sequelize;

function initializeSequelize() {

    if (environment === 'test') {

        // for testing
        sequelize = new Sequelize(config.database, config.username, config.password, {
            host: config.host,
            port: config.port,
            logging: true, // Disable the logging. It is consuming the time on lambda function.
            dialect: config.dialect,
            define: {
                timestamps: false
            },
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 20000,
                idle: 10000
            }
        });

    }
    else {
        sequelize =  new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            define: {
                freezeTableName: true,
                timestamps: false
            },
            omitNull: true,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
            operatorsAliases: Sequelize.Op,

            pool: {
                max: process.env.DB_POOL_MAX,
                min: process.env.DB_POOL_MIN,
                acquire: 30000,
                idle: process.env.DB_POOL_IDLE_TIMEOUT_MILLIS
            }
        });
    }

    return sequelize;
}

module.exports = {
    'Sequelize': Sequelize,
    'sequelize': initializeSequelize()
}

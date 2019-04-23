let db = require('../config/db');

let User = require('./user')(db.sequelize, db.Sequelize);

module.exports = {
    User
}

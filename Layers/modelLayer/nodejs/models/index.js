"use strict";

let { User, db } = require('./model/index');

module.exports = {
	sequelize: db.sequelize,
	User: User

}

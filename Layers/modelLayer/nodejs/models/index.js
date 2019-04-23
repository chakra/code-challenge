"use strict";

let { User } = require('./model/index');
let utility = require('util');
let constants = require('./constants');

function findUser(condition) {

	let user = User.findOne(condition)
		.catch( (err) => {
			throw (
				{
					code: err.statusCode || 501,
					body: JSON.stringify(utility.format(constants.DATABASE_ERROR, 'find', 'USER', error))
				}
			)
		});


	return user;

}

function deleteUser(condition) {
	User.findAndDelete(condition)
		.catch( (err) => {
			throw (
				{
					code: err.statusCode || 501,
					body: JSON.stringify(utility.format(constants.DATABASE_ERROR, 'delete', 'USER', error))
				}
			)
		});
}

function createUser(object) {
	let user = User.create(object)
		.catch( (err) => {
			throw (
				{
					code: err.statusCode || 501,
					body: JSON.stringify(utility.format(constants.DATABASE_ERROR, 'create', 'USER', error))
				}
			)
		});

	return user;
}

module.exports = {
	findUser: (condition) => findUser,
	deleteUser: (condition) => deleteUser,
	createUser: (object) => createUser
}

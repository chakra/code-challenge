"use strict";

let { User } = require('./user');
let utility = require('util');

async function findUser(condition) {
	
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

async function deleteUser(condition) {
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

async function createUser(condition) {
	let user = User.create(condition)
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
	createUser: (condition) => createUser
}	
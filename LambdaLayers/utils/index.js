"use strict";

let messages = require('./lib/messages');
let emailvalidator = require('email-validator');
let isValidBirthdate = require('is-valid-birthdate');

module.exports = {
	messages,
	emailValidator,
	isValidBirthdate
}

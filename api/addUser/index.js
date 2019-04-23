'use strict';

let dao = require('/opt/nodejs/models');
let utils = require('/opt/nodejs/utils');
let utility = require('util');


exports.handler = async (event, context) => {

    let response = {
        statusCode: 200,
        body: JSON.stringify('User Created'),
    };

    try {
        let user = JSON.parse(event.body);

        if(!utils.isValidBirthdate(user.dob) || !utils.emailvalidator(user.email)) {
            throw utility.format("Invalid Input dob %s, email %s ", user.dob, user.email);
        }

        await dao.createUser(user);
    } catch (err) {
        console.log(err);
        response = {
            statusCode: err.statusCode,
            body: JSON.stringify('Failed to Create User')
        }
    }

    return response;
};

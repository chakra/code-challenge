'use strict';

let { User } = require('/opt/nodejs/models');
let { isValidBirthdate, emailvalidator } = require('/opt/nodejs/utils');
let utility = require('util');

exports.handler = async (event, context) => {

    try {
        let user = JSON.parse(JSON.stringify(event.body));

        if(!isValidBirthdate(user.dob) ) {
            throw utility.format("Invalid Input dob %s ", user.dob);
        }

        if(!emailvalidator.validate(user.email)) {
            throw utility.format("Invalid Input email %s ",  user.email);
        }

        await createUser(user);
    } catch (err) {
        console.log(utility.format('Error thrown: %s %s', err.statusCode, err));
        return `Internal Server ERROR occurred`;
    }

    let response = {
        statusCode: 200,
        body: JSON.stringify('User Created'),
    };

    return response;
};


async function createUser(object) {
    let user = await User.create(object)
        .catch((err) => {
            throw (
                {
                    code: err.statusCode || 501,
                    body: JSON.stringify(utility.format('DATABASE ERROR %s %s %s', 'create', 'USER', err))
                }
            )
        });

    return user;
}
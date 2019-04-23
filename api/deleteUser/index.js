'use strict';

let dao = require('/opt/nodejs/models');
let utils = require('/opt/nodejs/utils');
let utility = require('util');


exports.handler = async (event, context) => {

    let response = {
        statusCode: 200,
        body: JSON.stringify('User is deleted'),
    };

    try {
        let id = event.pathParameters.id;
        let userCondition = utility.format("{ where: { id : %s } }", id);
        await dao.deleteUser(userCondition);
    } catch (err) {
        console.log(err);
        response = {
            statusCode: err.statusCode,
            body: JSON.stringify('Failed to Delete User')
        }
    }

    return response;
};

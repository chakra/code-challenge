'use strict';

let { User } = require('/opt/nodejs/models');
let utility = require('util');


exports.handler = async (event, context) => {

    try {
        let id = event.pathParameters.id;
        let user = await deleteUser(id);
        return await readResponse( 200, JSON.stringify(user));
    } catch (err) {
        console.log(utility.format('Error thrown: %s %s', err.statusCode, err));
        return `Internal Server ERROR occurred`;
    }



    return response;
};

async function readResponse(code, body) {
    let res = {
        statusCode: code,
        body: JSON.stringify(body)
    }

    return res;
}

async function deleteUser(condition) {
    await User.findAndDelete(condition)
        .catch((err) => {
            throw (
                {
                    code: err.statusCode || 501,
                    body: JSON.stringify(utility.format('DATABASE_ERROR: [%s] [%s], Error Thrown [%s]', 'delete', 'USER', error))
                }
            )
        });
}
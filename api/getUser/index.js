let dao = require('/opt/nodejs/models');
let utility = require('util');


exports.handler = async (event) => {
    let response = {
        statusCode: 200,
        body: JSON.stringify('User is deleted'),
    };

    try {
        let id = event.pathParameters.id;
        let userCondition = utility.format("{ where: { id : %s } }", id);
        await dao.findUser(userCondition);
    } catch (err) {
        console.log(err);
        response = {
            statusCode: err.statusCode,
            body: JSON.stringify('Failed to read user')
        }
    }

    return response;
};

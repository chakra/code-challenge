let {User} = require('/opt/nodejs/models');
let utility = require('util');

exports.handler = async (event) => {

    try {
        let id = event.pathParameters.id;
        let user = await findUser(id);
        return await readResponse( 200, JSON.stringify(user));
    } catch (err) {
        console.log(utility.format('Error throws %s %s', err.statusCode, err));
        return `Internal Server ERROR occurred`;
    }

};

async function readResponse(code, body) {
    let res = {
        statusCode: code,
        body: JSON.stringify(body)
    }

    return res;
}

async function findUser(condition) {
    let user = await User.findOne({where : { id : condition}})
        .catch((err) => {
            throw (
                {
                    code: err.statusCode || 501,
                    body: JSON.stringify(utility.format('DATABASE_ERROR: [%s] [%s], Error Thrown [%s]', 'select', 'USER', err))
                }
            )
        });

    return user;
}
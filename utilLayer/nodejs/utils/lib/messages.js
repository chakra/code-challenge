"use strict";

module.exports = {
    sendBadRequest: (event) => sendBadRequest(event),
    sendMessage: (messageDetails) => sendMessage(messageDetails),
    errorResponse: (schemaErrors) => errorResponse(schemaErrors)
}

async function sendMessage(messageDetails) {
    return {
        statusCode: messageDetails.code,
        body: JSON.stringify(messageDetails.message),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

async function sendBadRequest(event) {
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Bad Request',
            event: event
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
async function errorResponse(schemaErrors) {
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        };
    });
    return {
        status: 'failed',
        errors: errors
    };
}

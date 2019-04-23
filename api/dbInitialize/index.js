'use strict';

let dao = require('/opt/nodejs/models');
let sequelize = dao.sequelize;

/*
 * Lambda method main entry point
 */
exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));

    if (event.RequestType == "Delete") {
        sendResponse(event, context, "SUCCESS", { "message": "Skipped database initialization" }, callback);
        return;
    }

    sequelize.sync({ alter: true }).then(() => {
        sendResponse(event, context, "SUCCESS", { "message": "Database initialization is successful" }, callback);
    }).catch((error) => {
        console.log(error);
        sendResponse(event, context, "FAILED", { "error": "Database initialization failed" }, callback);
    });
};

const sendResponse = (event, context, responseStatus, responseData, callback) => {
    console.log(responseStatus, responseData);

  //  if (event.StackId) {
   //     IpUtils.CFNresponse.send(event, context, responseStatus, responseData); // triggerd by Cloudformation
  //  } else {
        context.callbackWaitsForEmptyEventLoop = false; // triggered manually
        if (responseData.error) {
            callback(responseData);
        } else {
            callback(null, responseData);
        }
  //  }

};

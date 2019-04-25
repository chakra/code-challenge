
const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;

const sinon = require('sinon');

//const proxyquire = require('proxyquire').noCallThru();


//let service = './lib/service'
let testedModuleName = '../index';

// This function is used as a default stub to force you to override it while adding tests
const stubMe = fnName => () => {
    throw new Error('Please stub this function call: ' + fnName);
};

const proxyquire = require('proxyquire').noCallThru();


describe('lambda', function() {

    describe('#handler', () => {

        let lambda = proxyquire(testedModuleName,
        { '/opt/nodejs/models': '/opt/nodejs/models', '/opt/nodejs/utils' : '/opt/node/utils' }
        );

        let name = 'joe';
        let email = 'joe@abc.net';
        let dob = '12-08-1990';

        let schemaInvalidForName =  { "body": { "names": name, "email": email, "dob": dob} };

        let schemaInvalidForEmail =  { "body": { "name": name, "emaill": email, "dob": dob} };
        let schemaInvalidForDOB =  { "body": { "name": name, "email": email, "dobb": dob} };

        let validSchema =  { "body": { "name": name, "email": email, "dob": dob} };


        let context = { succeed: function (result) { expect(result.valid).to.be.true; done(); }, fail: function () { done(new Error('never context.fail')); } };


        it ('should return schema validation error for name ', async function(done) {
            let expectedResponse = `[{"keyword":"required","dataPath":"","schemaPath":"#/required","params":{"missingProperty":"name"},"message":"should have required property 'name'"}]`;
            const response = await lambda.handler(schemaInvalidForName, context);
            console.log('response ' + response);
            //expect(response.body).to.equal(expectedResponse);
            expect(response.statusCode).to.equal(400);
            done();
        })

        it ('should return schema validation error for email', async function(done) {
            let expectedResponse = `[{"keyword":"required","dataPath":"","schemaPath":"#/required","params":{"missingProperty":"name"},"message":"should have required property 'name'"}]`;
            const response = await lambda.handler(schemaInvalidForEmail, context);
            //expect(response.body).to.equal(expectedResponse);
            expect(response.statusCode).to.equal(400);
            done();
        })

        it ('should return schema validation error for dob', async function(done) {
            let expectedResponse = `[{"keyword":"required","dataPath":"","schemaPath":"#/required","params":{"missingProperty":"name"},"message":"should have required property 'name'"}]`;
            const response = await lambda.handler(schemaInvalidForDOB, context);
            //expect(response.body).to.equal(expectedResponse);
            expect(response.statusCode).to.equal(400);
            done();
        })

    })
})


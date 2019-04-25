
const _ = require('lodash');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const sinon = require('sinon');

const redismock = require('redis-mock');
const proxyquire = require('proxyquire').noCallThru();

const service = require('../lib/service');

//let service = './lib/service'
const testedModuleName = '../index';

// This function is used as a default stub to force you to override it while adding tests
const stubMe = fnName => () => {
    throw new Error('Please stub this function call: ' + fnName);
};

/**
 * Then you prepare a higher order function that will help you easily override the default stub
 * If any external dependency is added to the tested module, you have to add its called functions here as well
 * As you can see, all default stubs are throwing functions, to ensure you will properly stub in the context of each test,
 * and that each test will be independent from the others
 */
const createStubs = customStubs => _.defaults({}, customStubs, {
    [service]: { fnA: stubMe('fnA'),
    checkAuthentication: stubMe('checkAuthentication')}

});


describe('lambda', function() {

    describe('#handler', () => {


        let lambda = proxyquire(testedModuleName, createStubs({
            [service]: { 'mfa-common-cache': redismock }
        }));

        let tx = 'TX|d2lsbGlhbS5saXVAZnVqaXhlcm94LmNvbXxESVBWS1A3VFVQR09VN004SUhUV3wxNTQ5MzI5MDU5|3f6f55c37cd402f3e3d0675d0d84afd2e3cfda5c';
        let parentUrl = 'https://envl.portal.fxdms.net/idp/profile/SAML2/Redirect/SSO;jsessionid=B6694899F954660AF06717A722B9E308?execution=e1s2';
        let v = '2.6';

        let schemaInvalidForTx =  {"identity": {"sourceIp":"192.168.0.1"}, "body": { "txInvalid": tx, "parent": parentUrl, "v": v } };
        let schemaInvalidForParent =  {"identity": {"sourceIp":"192.168.0.1"}, "body": { "tx": tx, "parentInvalid": parentUrl, "v": v } };
        let schemaInvalidForV =  {"identity": {"sourceIp":"192.168.0.1"}, "body": { "tx": tx, "parent": parentUrl, "vInvalid": v } };
        let validSchema = {"identity": {"sourceIp":"192.168.0.1"}, "body": { "tx": tx, "parent": parentUrl, "v": v } };

        let session = "Yzk1NmExYzgtOTg4Ni00MTYwLTkwYzUtZjlkOGZlMTNkMjU2fDE1NDk0MTY2NDl8NzAuMTMyLjI5LjE0MQ==|ba4aa3ac590348fd227964f40b8dda94c3598ad6ee0d9d47fdc57c7e6d348f86";

        let expectedPromptResponse = { "stat": "PROMPT", "response": { "session": session }};

        let context = { succeed: function (result) { expect(result.valid).to.be.true; done(); }, fail: function () { done(new Error('never context.fail')); } };

        before ( function() {
           sinon.stub(service, 'checkAuthentication').withArgs(sinon.match.any, sinon.match.any).returns(expectedPromptResponse);
        });

        after( function() {
            service.checkAuthentication.restore();
        });

        it ('should return schema validation error for tx', async function(done) {
            let expectedResponse = `{"status":"failed","errors":[{"path":"","message":"should have required property \'tx\'"}]}`;
            const response = await lambda.handler(schemaInvalidForTx, context);
            expect(response.body).to.equal(expectedResponse);
            expect(response.statusCode).to.equal(400);
            done();
        })

        it ('should return schema validation error for parent', async function(done) {
            let expectedResponse = `{"status":"failed","errors":[{"path":"","message":"should have required property \'parent\'"}]}`;
            const response = await lambda.handler(schemaInvalidForParent, context);
            expect(response.body).to.equal(expectedResponse);
            expect(response.statusCode).to.equal(400);
            done();
        })

        it ('should return schema validation error for v', async function(done) {
            let expectedResponse = `{"status":"failed","errors":[{"path":"","message":"should have required property \'v\'"}]}`;
            const response = await lambda.handler(schemaInvalidForV, context);
            expect(response.body).to.equal(expectedResponse);
            expect(response.statusCode).to.equal(400);
            done();
        })

        it ('should return success', async function(done) {
            const response = await lambda.handler(validSchema, context);
            expect(response.body).to.equal('"Success"');
            expect(response.statusCode).to.equal(200);
            done();
        })

        it ('should throw Internal Server Error', async function(done) {
            service.checkAuthentication.restore();
            sinon.stub(service, 'checkAuthentication').withArgs(sinon.match.any, sinon.match.any).throws("undefined");
            const expectedResponse = "[InternalServerError] An error has occurred while processing the request.";
            try {
                const response = await lambda.handler(validSchema, context);
                expect(response).to.equal(expectedResponse);
                done();
            } catch (e) {
                console.log(e);
                done();
            }

        })

    })
})


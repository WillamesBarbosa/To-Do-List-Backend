jest.mock('../../../../src/app/services/loginService/loginService', () => jest.fn());
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn())

const loginService = require('../../../../src/app/services/loginService/loginService');

const loginController = require('../../../../src/app/controllers/LoginController/loginController');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');

let response;

beforeEach(()=>{
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
})

describe('Test LoginController', ()=>{
    test('Should return 200 and token', async()=>{
        loginService.mockResolvedValue({
            isValid: true,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTk5OTk5OTl9.mockSignature'    
        })

        await loginController.login({body: {email: 'email@email.com', password: '123'}}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status)
    })

})
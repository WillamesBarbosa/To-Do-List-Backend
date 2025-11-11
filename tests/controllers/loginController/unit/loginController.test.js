jest.mock('../../../../src/app/services/loginService/loginService', () => jest.fn());
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn())

const loginService = require('../../../../src/app/services/loginService/loginService');
const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams');
const isValidEmail = require('../../../../src/app/utils/validators/isValidEmail/isValidEmail');

const loginController = require('../../../../src/app/controllers/LoginController/loginController');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');

let response;

beforeEach(()=>{
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
})

describe('Test LoginController', ()=>{
    test('Should return 400 of email or password is a empty string', async()=>{
        verifyParams.mockReturnValue({valid: false, message: 'Password is invalid'});

        await expect(loginController.login({body: {email: 'email@email.com', password: ''}}, response)).rejects.toMatchObject({
            message: 'Password is invalid',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 if email is invalid', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: false, message: 'Email is invalid'});

        await expect(loginController.login({body: {email: 'email#email.com', password: '123'}}, response)).rejects.toMatchObject({
            message: 'Email is invalid',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 if password is incorrect', async () => {
        verifyParams.mockReturnValue({ valid: true });
        isValidEmail.mockReturnValue({ isValid: true });
        loginService.mockResolvedValue({
        isValid: false,
        message: 'Password is incorrect'
        });

        await expect(loginController.login({ body: { email: 'email@email.com', password: '123' } }, response)
        ).rejects.toMatchObject({
        message: 'Password is incorrect',
        statusCode: responsesHTTP.BAD_REQUEST.status
        });
    });

    test('Should return 200 and token', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        loginService.mockResolvedValue({
            isValid: true,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTk5OTk5OTl9.mockSignature'    
        })

        await loginController.login({body: {email: 'email@email.com', password: '123'}}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status)
    })

})
jest.mock('../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository', () => ({
    findByUserId: jest.fn(),
    delete: jest.fn(),
    save: jest.fn()
}));

jest.mock('../../../../src/app/services/loginService/loginService', () => jest.fn());
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn())


const loginController = require('../../../../src/app/controllers/LoginController/loginController');
const loginService = require('../../../../src/app/services/loginService/loginService');
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
            token: 'fake-access-jwt',
            refreshToken: 'fake-refresh-jwt'
        })

        await loginController.login({body: {email: 'email@email.com', password: '123'}}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status)
    })

})
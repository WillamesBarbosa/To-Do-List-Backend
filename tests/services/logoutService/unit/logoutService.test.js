jest.mock('../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository', () => ({
    revokeToken: jest.fn()
}));
jest.mock('../../../../src/app/utils/helpers/authenticationToken/authenticationToken', () => jest.fn());

const RefreshTokenRepository = require('../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository');
const authenticationToken = require('../../../../src/app/utils/helpers/authenticationToken/authenticationToken');
const logoutService = require('../../../../src/app/services/logoutService/logoutService');

beforeEach(() => jest.clearAllMocks());
describe('Test logoutService', ()=>{

    test('Should not call deleteUser if token is invalid', async()=>{
        authenticationToken.mockReturnValue({isValid: false});

        await logoutService({headers: { x_token_refresh: 'invalid'}});

        expect(RefreshTokenRepository.revokeToken).not.toHaveBeenCalled();
    })

    test('Should call deleteUser if token is valid', async()=>{
        authenticationToken.mockReturnValue({isValid: true, decoded: {id: 'fake-id'}});

        await logoutService({headers: {x_token_refresh: 'jwt-refresh-token'}});

        expect(RefreshTokenRepository.revokeToken).toHaveBeenCalled()
    })
})
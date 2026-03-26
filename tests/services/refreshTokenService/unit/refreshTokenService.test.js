jest.mock('../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository', () => ({
    findByUserId: jest.fn(),
    revokeToken: jest.fn(),
    save: jest.fn()
}));
jest.mock('../../../../src/app/utils/helpers/authenticationToken/authenticationToken', ()=> jest.fn());
jest.mock('../../../../src/app/utils/helpers/generateToken/generateToken', ()=> jest.fn());

const { findByUserId, save, revokeToken } = require("../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository");
const refreshTokenService = require("../../../../src/app/services/refreshTokenService.js/refreshTokenService")
const authenticationToken = require("../../../../src/app/utils/helpers/authenticationToken/authenticationToken");
const generateToken = require("../../../../src/app/utils/helpers/generateToken/generateToken");
const responsesHTTP = require("../../../../src/app/utils/helpers/responsesHTTPS");

describe('Test refreshTokenService', ()=>{
    test('Should return 401 unauthorized if token not informed', async()=>{
        authenticationToken.mockReturnValue({
            isValid: false,
            error: responsesHTTP.UNAUTHORIZED.message
        });
        await expect(refreshTokenService({headers:{
            x_token_refresh: ''
        }
        })).rejects.toMatchObject({
            message: responsesHTTP.UNAUTHORIZED.message,
            statusCode: responsesHTTP.UNAUTHORIZED.status
        })
    })

    test('Should return 401 unauthorized if id not exist in redis', async()=>{
        authenticationToken.mockReturnValue({
            isValid: true,
            decoded:{
                id: 'fake-id'
            }
        })
        findByUserId.mockResolvedValue(false);
       
               
        await expect(refreshTokenService({headers:{
            x_token_refresh: 'fake-jwt-token'
        }
        })).rejects.toMatchObject({
            message: responsesHTTP.UNAUTHORIZED.message,
            statusCode: responsesHTTP.UNAUTHORIZED.status
        })
    })

    test('Should return tokens', async()=>{
        authenticationToken.mockReturnValue({
            isValid: true,
            decoded:{
                id: 'fake-id'
            }
        })
        findByUserId.mockResolvedValue(true);
        revokeToken.mockResolvedValue();
        save.mockResolvedValue();
        generateToken        
        .mockReturnValueOnce('fake-refresh-token')
        .mockReturnValueOnce('fake-access-token');

        const result = await refreshTokenService({headers: {x_token_refresh:'fake-jwt-refresh'}});

        expect(result).toEqual({
            token: 'fake-access-token',
            refreshToken: 'fake-refresh-token'
        })
    })
})
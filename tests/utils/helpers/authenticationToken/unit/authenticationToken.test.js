const jwt = require('jsonwebtoken');
const authenticationToken = require('../../../../../src/app/utils/helpers/authenticationToken/authenticationToken');

describe('Test authenticationService', ()=>{
    test('Should return token not informed', ()=>{
        const result = authenticationToken();

        expect(result.isValid).toEqual(false)
        expect(result.message).toEqual({error: 'Token not informed'})
    })

    test('Should return token expired', ()=>{
        const error = new Error('TokenExpiredError');
        error.name = 'TokenExpiredError';

         jwt.verify = jest.fn().mockImplementation(()=>{
            throw error
        })
        const result = authenticationToken(
            'Bearer fake-jwt-token',
            'secret',
            'Bearer'
        );

        expect(result.isValid).toEqual(false)
        expect(result.message).toEqual({error: 'Token expired.'})
    })

    test('Should return token expired', ()=>{
        const error = new Error('TokenExpiredError');
        error.name = 'jsonWebTokenError';

        jwt.verify = jest.fn().mockImplementation(()=>{
            throw error
        })
        const result = authenticationToken(
            'Bearer fake-jwt-token',
            'secret',
            'Bearer'
        );

        expect(result.isValid).toEqual(false)
        expect(result.message).toEqual({error: 'Token invalid.'})
    })

    test('Should return a token', ()=>{
        const error = new Error('TokenExpiredError');
        error.name = 'jsonWebTokenError';

        jwt.verify = jest.fn().mockReturnValue({
            isValid: true,
            decoded: 'Bearer fake-jwt-token'
        }
        )
        const result = authenticationToken(
            'Bearer fake-jwt-token',
            'secret',
            'Bearer'
        );

        expect(result.isValid).toEqual(true)
        expect(result.decoded).toEqual({
            decoded:'Bearer fake-jwt-token',
            isValid: true
        }
        )
    })
})
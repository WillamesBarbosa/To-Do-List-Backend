const jwt = require('jsonwebtoken');
const authenticationService = require('../../../../src/app/services/authenticationService/authenticationService');

describe('Test authenticationService', ()=>{
    test('Should return token not informed', async()=>{
        const result = await authenticationService();

        expect(result.isValid).toEqual(false)
        expect(result.message).toEqual({error: 'Token not informed'})
    })

    test('Should return token expired', async()=>{
        const error = new Error('TokenExpiredError');
        error.name = 'TokenExpiredError';

         jwt.verify = jest.fn().mockImplementation(()=>{
            throw error
        })
        const result = await authenticationService(
            'Bearer auKbcGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
        );

        expect(result.isValid).toEqual(false)
        expect(result.message).toEqual({error: 'Token expired.'})
    })

    test('Should return token expired', async()=>{
        const error = new Error('TokenExpiredError');
        error.name = 'jsonWebTokenError';

        jwt.verify = jest.fn().mockImplementation(()=>{
            throw error
        })
        const result = await authenticationService(
            'Bearer caJdcGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
        );

        expect(result.isValid).toEqual(false)
        expect(result.message).toEqual({error: 'Token invalid.'})
    })

    test('Should return a token', async()=>{
        const error = new Error('TokenExpiredError');
        error.name = 'jsonWebTokenError';

        jwt.verify = jest.fn().mockReturnValue(
            'kbUabGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'

        )
        const result = await authenticationService(
            'Bearer kbUabGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
        );

        console.log(result)
        expect(result.isValid).toEqual(true)
        expect(result.decoded).toEqual(
            'kbUabGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
        )
    })
})
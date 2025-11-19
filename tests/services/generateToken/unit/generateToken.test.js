const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../../../../src/app/services/generateToken/generateToken');
const user ={
    name: 'name',
    email: 'email@email.com',
    password: 'passwordHashed'
}

const password = '123456'
describe('Test generateToken', ()=>{

    test('Should return false', async()=>{
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const result = await generateToken(user, password)

        expect(result).toEqual(false);
    })

        test('Should return a token', async()=>{
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign= jest.fn()
        .mockResolvedValue(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
        );

        const result = await generateToken(user, password)

        expect(result).toEqual(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
);
    })
})
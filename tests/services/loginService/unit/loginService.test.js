jest.mock(
  "../../../../src/app/repositories/UserRepository/userRepository",
  () => ({
    findByEmail: jest.fn()
  })
);

jest.mock('../../../../src/app/services/generateToken/generateToken', ()=> jest.fn())


const { findByEmail } = require("../../../../src/app/repositories/UserRepository/userRepository");
const generateToken = require("../../../../src/app/services/generateToken/generateToken");
const loginService = require("../../../../src/app/services/loginService/loginService")

const user = {
    email: 'email@email.com',
    password: '123456'
}

            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'

describe('Test loginService', ()=>{

    test('Should return email not found', async()=>{
        findByEmail.mockResolvedValue(null)
        const response = await loginService(user.email)

        expect(response.isValid).toEqual(false);
        expect(response.message).toEqual({ error: 'Email not found.'});

    })

    test('Should return password incorrect', async()=>{
    findByEmail.mockResolvedValue(user);
    generateToken.mockResolvedValue(false);
    const response = await loginService(user.email)

    expect(response.isValid).toEqual(false);
    expect(response.message).toEqual({ error: 'Password incorrect.'});

    })

    test('Should return password incorrect', async()=>{
    findByEmail.mockResolvedValue(user);
    generateToken.mockResolvedValue(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'
    );

    const response = await loginService(user.email)

    expect(response.isValid).toEqual(true);
    expect(response.token).toEqual(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJpYXQiOjE2ODUzNTE4MDAsImV4cCI6MTY4NTM1NTQwMH0.DpQj-X1G0EYqRs0k4EPvb732xgvYrTddmQew6FYEWzo'

    );

    })
})
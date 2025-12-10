jest.mock(
  "../../../../src/app/repositories/UserRepository/userRepository",
  () => ({
    findByEmail: jest.fn()
  })
);

jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn())
jest.mock('../../../../src/app/services/generateToken/generateToken', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())


const isValidEmail = require("../../../../src/app/utils/validators/isValidEmail/isValidEmail");
const verifyParams = require("../../../../src/app/utils/validators/verifyParams/verifyParams");
const { findByEmail } = require("../../../../src/app/repositories/UserRepository/userRepository");
const generateToken = require("../../../../src/app/services/generateToken/generateToken");
const loginService = require("../../../../src/app/services/loginService/loginService");
// const responsesHTTP = require("../../../../src/app/utils/helpers/responsesHTTPS");

beforeEach(()=>{
    jest.clearAllMocks();
})


const user = {
    email: 'email@email.com',
    password: '123456'
}


describe('Test loginService', ()=>{

    test('Should return 400 of email or password is a empty string', async()=>{
        verifyParams.mockReturnValue({valid: false, message:'Password is invalid.'});

        await expect(
            loginService({ body: { email: 'email@email.com', password: '' } })
        ).rejects.toThrow('Password is invalid.')
        await expect(
            loginService({ body: { email: 'email@email.com', password: '' } })
        ).rejects.toMatchObject({statusCode: 400})
    })

    test('Should return 400 if email is invalid', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: false, message: 'Email is invalid'});

        await expect(
            loginService({ body: { email: 'email@email.com', password: '' } })
        ).rejects.toThrow('Email is invalid')
        await expect(
            loginService({ body: { email: 'email@email.com', password: '' } })
        ).rejects.toMatchObject({statusCode: 400})
    })

    test('Should return email not found', async()=>{
        verifyParams.mockReturnValue({ valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        findByEmail.mockResolvedValue(null)


        await expect(
            loginService({ body: { email: 'email@email.com', password: '' } })
        ).rejects.toMatchObject({message: {error: 'Email not found.'}})
        await expect(
            loginService({ body: { email: 'email@email.com', password: '' } })
        ).rejects.toMatchObject({statusCode: 400})


    })

    test('Should return password incorrect', async()=>{
    findByEmail.mockResolvedValue(user);
    generateToken.mockResolvedValue(false);
    findByEmail.mockResolvedValue({email :'email@email.com', password: '123456'})
    generateToken.mockResolvedValue(false)

    
    await expect(loginService({body: {email :'email@email.com', password: '123'}})).rejects.toMatchObject({message: {error: 'Password incorrect.'}})
    await expect(loginService({body: {email :'email@email.com', password: '123'}})).rejects.toMatchObject({ statusCode: 400})

    })

    test('Should return 200 and token', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        findByEmail.mockResolvedValue(user)
        generateToken.mockResolvedValue({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTk5OTk5OTl9.mockSignature'    
        })

        const result = await loginService({body: {email: 'email@email.com', password: '123'}})
        
        expect(result).toMatchObject({
            isValid: true,
            token: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTk5OTk5OTl9.mockSignature'
                }
            });

    })
})
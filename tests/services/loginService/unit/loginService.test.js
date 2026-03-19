jest.mock(
  "../../../../src/app/repositories/UserRepository/userRepository",
  () => ({
    findByEmail: jest.fn()
  })
);
jest.mock('../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository', () => ({
    deleteUser: jest.fn(),
    save: jest.fn()
}));

jest.mock('../../../../src/app/utils/helpers/validatePassword/validatePassword', ()=> jest.fn());
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn());
jest.mock('../../../../src/app/utils/helpers/generateToken/generateToken', ()=> jest.fn());
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn());


const isValidEmail = require("../../../../src/app/utils/validators/isValidEmail/isValidEmail");
const verifyParams = require("../../../../src/app/utils/validators/verifyParams/verifyParams");
const { findByEmail } = require("../../../../src/app/repositories/UserRepository/userRepository");
const loginService = require("../../../../src/app/services/loginService/loginService");
const validatePassword = require("../../../../src/app/utils/helpers/validatePassword/validatePassword");
const generateToken = require("../../../../src/app/utils/helpers/generateToken/generateToken");
const RefreshTokenRepository = require('../../../../src/app/repositories/RefreshTokenRepository/RefreshTokenRepository');
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
    findByEmail.mockResolvedValue({email :'email@email.com', password: '123456'});
    validatePassword.mockResolvedValue(false)
    
    await expect(loginService({body: {email :'email@email.com', password: '123'}})).rejects.toMatchObject({message: {error: 'Password incorrect.'}})
    await expect(loginService({body: {email :'email@email.com', password: '123'}})).rejects.toMatchObject({ statusCode: 400})

    })

    test('Should return 200 and token', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        findByEmail.mockResolvedValue(user);
        validatePassword.mockResolvedValue(true);
        RefreshTokenRepository.deleteUser.mockResolvedValue();
        RefreshTokenRepository.save.mockResolvedValue();
        generateToken        
        .mockReturnValueOnce('fake-access-token')
        .mockReturnValueOnce('fake-refresh-token');

        const result = await loginService({body: {email: 'email@email.com', password: '123'}})
        
        expect(result).toMatchObject({
            isValid: true,
            token: 'fake-access-token',
            refreshToken: 'fake-refresh-token'
            });

        expect(RefreshTokenRepository.save).toHaveBeenCalledWith(
        user.id,
        'fake-refresh-token'
        ) ;  

    })
})
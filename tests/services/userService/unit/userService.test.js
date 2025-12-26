jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn());
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn());
jest.mock('../../../../src/app/utils/helpers/generateUUID', ()=> jest.fn());
jest.mock('../../../../src/app/services/hashPassword/hashPassword', ()=> jest.fn());
jest.mock('../../../../src/app/utils/helpers/updateAt/updateAt', ()=> jest.fn());

const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams')
const isValidEmail = require('../../../../src/app/utils/validators/isValidEmail/isValidEmail');
const generateUUID = require('../../../../src/app/utils/helpers/generateUUID');
const hashPassword = require('../../../../src/app/services/hashPassword/hashPassword');
const updateAt = require('../../../../src/app/utils/helpers/updateAt/updateAt');


const userService = require('../../../../src/app/services/userService/userService');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');
const userRepository = require('../../../../src/app/repositories/UserRepository/userRepository');
describe('Test findAll', ()=>{
    test('Should return 204 if not exist data', async()=>{
        userRepository.findAll = jest.fn().mockResolvedValue([]);

        expect(userService.findAll()).rejects.toMatchObject({
            message: responsesHTTP.NO_CONTENT.message,
            statusCode: responsesHTTP.NO_CONTENT.status
        })
    })

    test('Should return array of users', async()=>{
        userRepository.findAll = jest.fn().mockResolvedValue([
            {
                id: '123e4567-e89b-42d3-a456-426614174003', 
                name: 'name',
                email: 'email@email.com'
            },
            {
                id: '123e4567-e89b-42d3-a456-426614174993', 
                name: 'name1',
                email: 'email1@email.com'
            }
        ])

        const response = await userService.findAll();

        expect(response).toEqual([
            {
                id: '123e4567-e89b-42d3-a456-426614174003', 
                name: 'name',
                email: 'email@email.com'
            },
            {
                id: '123e4567-e89b-42d3-a456-426614174993', 
                name: 'name1',
                email: 'email1@email.com'
            }
        ])
    })
})

describe('Test getUser', ()=>{
    test('Should return user', async()=>{
        userRepository.findById = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174003', 
                name: 'name',
                email: 'email@email.com'
            })

        const response = await userService.getUser({id: '123e4567-e89b-42d3-a456-426614174003'});

        expect(response).toEqual({
                id: '123e4567-e89b-42d3-a456-426614174003', 
                name: 'name',
                email: 'email@email.com'
            })
    })
})

describe('Test create', ()=>{
    test('Should return 400 if name is empty', async()=>{
        verifyParams.mockReturnValue({valid: false, message: {error: 'Name is required.'}});

        await expect(userService.create({body: {name: '', email: 'email@email.com', password: 'password'}}))
        .rejects.toMatchObject({
            message: {error: 'Name is required.'},
            statusCode: responsesHTTP.BAD_REQUEST.status
        })

    })

    test('Should return 400 if email is invalid', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: false, message: {error: 'Email is invalid.'}});

        await expect(userService.create({body: {name: 'name', email: 'email#email.com', password: 'password'}}))
        .rejects.toMatchObject({
            message: {error: 'Email is invalid.'},
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 if email already exists', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        userRepository.findByEmail = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003', 
            name: 'name',
            email: 'email@email.com',
            password: 'password'
        })       

        await expect(userService.create({body: {name: 'name', email: 'email@email.com', password: 'password'}}))
        .rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return user created', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        userRepository.findByEmail = jest.fn().mockResolvedValue(null);
        generateUUID.mockReturnValue('123e4567-e89b-42d3-a456-426614174003');
        hashPassword.mockReturnValue('passwordHashed');
        userRepository.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003',
            name: 'name', 
            email: 'email@email.com', 
            password: 'passwordHashed'
        })

        const response = await(userService.create({body: {name: 'name', email: 'email@email.com', password: 'password'}}));

        expect(response).toEqual({
            id: '123e4567-e89b-42d3-a456-426614174003',
            name: 'name', 
            email: 'email@email.com', 
            password: 'passwordHashed'
        })
    })
})

describe('Test update', ()=>{
    test('Should return 400 if name is empty', async()=>{
        verifyParams.mockReturnValue({valid: false, message: {error: 'Name is required.'}});

        await expect(userService.update({
            id: '123e4567-e89b-42d3-a456-426614174003', 
            body: {name: ''}}))
        .rejects.toMatchObject({
            message: {error: 'Name is required.'},
            statusCode: responsesHTTP.BAD_REQUEST.status
        })

    })

    test('Should return user updated', async()=>{
        verifyParams.mockReturnValue({valid: true});
        userRepository.findById = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003', 
            name: 'name1',
            email: 'email@email.com',
            updateAt: 'Mon Jan 01 2024 00:00:00 GMT+0000'
        });

        updateAt.mockReturnValue('Mon Jan 01 2024 00:00:00 GMT+0000');
        
        userRepository.update = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003', 
            name: 'name',
            email: 'email@email.com',
            updateAt: 'Mon Jan 01 2024 00:00:00 GMT+0000'
        })

        const response = await userService.update({
            id: '123e4567-e89b-42d3-a456-426614174003',
            body: {
                name: 'name',
            }
        })

        expect(response).toEqual({
            id: '123e4567-e89b-42d3-a456-426614174003', 
            name: 'name',
            email: 'email@email.com',
            updateAt: 'Mon Jan 01 2024 00:00:00 GMT+0000'
        })
    })
})

describe('Test deleteUser', ()=>{
    test('Should return nothing', async()=>{
        userRepository.delete = jest.fn().mockResolvedValue(1);
        
        await expect(userService.deleteUser({id: '123e4567-e89b-42d3-a456-426614174003' })).resolves.not.toThrow()

    })
})
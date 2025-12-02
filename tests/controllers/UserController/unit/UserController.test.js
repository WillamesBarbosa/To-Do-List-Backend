jest.mock('../../../../src/app/utils/validators/isValidUUid/isValidUUID', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn())
jest.mock('../../../../src/app/utils/helpers/generateUUID', ()=> jest.fn())
jest.mock('../../../../src/app/services/hashPassword/hashPassword', ()=> jest.fn())
jest.mock('../../../../src/app/utils/helpers/updateAt/updateAt', ()=> jest.fn())

const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams');
const isValidEmail = require('../../../../src/app/utils/validators/isValidEmail/isValidEmail');
const updateAt = require('../../../../src/app/utils/helpers/updateAt/updateAt')
const generateUUID = require('../../../../src/app/utils/helpers/generateUUID');
const hashPassword = require('../../../../src/app/services/hashPassword/hashPassword');

const userController = require('../../../../src/app/controllers/UserController/userController');
const userRepository = require('../../../../src/app/repositories/UserRepository/userRepository');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable')
const database = require('../../../../src/database/config/config-knex')

let response;

beforeAll(async () => {
    await generateTable('users');

  });

beforeEach(()=>{
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
})

afterAll(async () => {
  await database.destroy();
});

describe('Test index in UserController', ()=>{
    test('Should return 204 if id theres no in database', async()=>{
        userRepository.findAll = jest.fn().mockResolvedValue([]);

        await expect(userController.index({}, response)).rejects.toMatchObject({
            message: responsesHTTP.NO_CONTENT.message,
            statusCode: responsesHTTP.NO_CONTENT.status
        })
    })

    test('Should return 200 and users', async()=>{
        userRepository.findAll = jest.fn().mockResolvedValue([{ id: 1, name: 'name', email: 'email@email.com', password: '123'}]);

        await userController.index({}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status);
        expect(response.json).toHaveBeenCalledWith([{ id: 1, name: 'name', email: 'email@email.com', password: '123'}]);
    })
})

describe('Test show in UserController', ()=>{
    test('Should return 200 and user', async()=>{
        userRepository.findById = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174000', name: 'name', password: '123', email: 'email@email.com'
        })

        await userController.show({ id: '123e4567-e89b-42d3-a456-426614174000' }, response)

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status);
        expect(response.json).toHaveBeenCalledWith({
            id: '123e4567-e89b-42d3-a456-426614174000', name: 'name', password: '123', email: 'email@email.com'
        })
    })
})


describe('Test store in UserController', ()=>{
    test('Should retun 400 if email empty', async()=>{
        verifyParams.mockReturnValue({valid: false, message: 'Email is required'})

        await expect(userController.store({body: {name: 'name', email: '', password: '123'}}, response)).rejects.toMatchObject({
            message: 'Email is required',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 if email is invalid', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: false, message: 'Email is invalid'});

        await expect(userController.store({ body: { name: 'name', email: 'email#email.com', password: '123'}}, response))
        .rejects.toMatchObject({
            message: 'Email is invalid',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 if email already exist', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        userRepository.findByEmail = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174000', name: 'name', password: '123', email: 'email@email.com'
        })

        await expect(userController.store({body: {name: 'name', email: 'email@email.com', password: '123'}}, response))
        .rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 201 and user', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        userRepository.findByEmail = jest.fn().mockResolvedValue(null);
        generateUUID.mockReturnValue('123e4567-e89b-42d3-a456-426614174000');
        hashPassword.mockResolvedValue('passwordhashed');

        await userController.store({body: {
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'name', 
                email: 'email@email.com',
                password: 'passwordhashed'
            }}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.CREATED.status);
        expect(response.json).toHaveBeenCalledWith(
            expect.objectContaining({
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'name',
                email: 'email@email.com',
        })
);

    })
})

describe('Test update in userController', ()=>{
    test('Should return 400 if name or email is empty', async()=>{
        verifyParams.mockReturnValue({valid: false, message: 'Name is required'});

        await expect(userController.update({
            params: {id: '123e4567-e89b-42d3-a456-426614174000'}, 
            body: {name: '', email: 'email@email.com'}}, response ))
        .rejects.toMatchObject({
            message: 'Name is required',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 if name or email is invalid', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: false, message: 'Email is invalid'});

        await expect(userController.update({
            params: {id: '123e4567-e89b-42d3-a456-426614174000'}, 
            body: {name: 'name', email: 'email#email.com'}}, response ))
        .rejects.toMatchObject({
            message: 'Email is invalid',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })


    test('Should return 400 if email are equal', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        userRepository.findByEmail = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174000',
            name: 'name',
            email: 'email@email.com'
        })

        await expect(userController.update({
            body: {id: '123e4567-e89b-42d3-a456-426614174000', name: 'name', email: 'email@email.com'}}, response ))
        .rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 200 if user are updated', async()=>{
        verifyParams.mockReturnValue({valid: true});
        isValidEmail.mockReturnValue({isValid: true});
        userRepository.findByEmail = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174000',
            name: 'name1',
            email: 'email1@email.com'
    })
        updateAt.mockReturnValue('Mon Jan 01 2024 00:00:00 GMT+0000');
        
        userRepository.update = jest.fn().mockResolvedValue(
            {
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'name',
                email: 'email@email.com',
                updateAt: 'Mon Jan 01 2024 00:00:00 GMT+0000'
        }
        )

        await userController.update({
            id: '123e4567-e89b-42d3-a456-426614174000',
            body: {
                name: 'name', email: 'email@email.com'
            }
        }, response);

        expect(response.json).toHaveBeenCalledWith(
            expect.objectContaining({
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'name',
                email: 'email@email.com',
                updateAt: 'Mon Jan 01 2024 00:00:00 GMT+0000'
        })
        )
    })
})


describe('Delete test in UserController', ()=>{
    test('Should return 200', async()=>{
        userRepository.findById = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174000',
            name: 'name',
            email: 'email@email.com'
        });
        userRepository.delete = jest.fn().mockResolvedValue('1');

        await userController.delete({params: {id: '123e4567-e89b-42d3-a456-426614174000'}}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status)
    })


})
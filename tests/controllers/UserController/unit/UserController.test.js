jest.mock('../../../../src/app/utils/validators/isValidUUid/isValidUUID', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/isValidEmail/isValidEmail', ()=> jest.fn())
const isValidUUID = require('../../../../src/app/utils/validators/isValidUUid/isValidUUID');
const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams');
const isValidEmail = require('../../../../src/app/utils/validators/isValidEmail/isValidEmail');

const userController = require('../../../../src/app/controllers/UserController/userController');
const userRepository = require('../../../../src/app/repositories/UserRepository/userRepository');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');

let response;

beforeEach(()=>{
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
})

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
    test('Should return 400 if id is invalid', async()=>{
        isValidUUID.mockReturnValue(false);

        await expect(userController.show({params: { id: 1}}, response)).rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 404 if id not exists', async()=>{
        isValidUUID.mockReturnValue(true);
        userRepository.findById = jest.fn().mockResolvedValue(null);

        await expect(userController.show({params: { id: '123e4567-e89b-42d3-a456-426614174000' }}, response)).rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })

    })

    test('Should return 200 and user', async()=>{
        isValidUUID.mockReturnValue(true)
        userRepository.findById = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174000', name: 'name', password: '123', email: 'email@email.com'
        })

        await userController.show({ params: { id: '123e4567-e89b-42d3-a456-426614174000' }}, response)

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
        isValidEmail.mockReturnValue({valid: false, message: 'Email is invalid'});

        await expect(userController.store({ body: { name: 'name', email: 'email#email.com', password: '123'}}, response))
        .rejects.toMatchObject({
            message: 'Email is invalid',
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })
})
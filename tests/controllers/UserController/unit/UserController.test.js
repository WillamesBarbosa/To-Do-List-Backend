const userController = require('../../../../src/app/controllers/UserController/userController');
const userService = require('../../../../src/app/services/userService/userService');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');
let response;

beforeEach(() => {
        response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
});

describe('Test index', ()=>{
    test('Should return array of a user', async()=>{
        userService.findAll = jest.fn().mockResolvedValue([
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

        await userController.index({}, response);

        expect(response.json).toHaveBeenCalledWith([
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

describe('Test show', ()=>{
    test('Should return user', async()=>{
        userService.getUser = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174993', 
                name: 'name1',
                email: 'email1@email.com'
            })

        await userController.show({id: '123e4567-e89b-42d3-a456-426614174993'}, response);

        expect(response.json).toHaveBeenCalledWith({
                id: '123e4567-e89b-42d3-a456-426614174993', 
                name: 'name1',
                email: 'email1@email.com'
            })
    })
})

describe('Test store', ()=>{
    test('Should return user created', async()=>{
        userService.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003',
            name: 'name', 
            email: 'email@email.com', 
            password: 'passwordHashed'
        })

        await userController.store({
            name: 'name', 
            email: 'email@email.com', 
            password: 'passwordHashed'
        }, response);

        expect(response.json).toHaveBeenCalledWith({
            id: '123e4567-e89b-42d3-a456-426614174003',
            name: 'name', 
            email: 'email@email.com', 
            password: 'passwordHashed'
        })
    })
})

describe('Test update', ()=>{
    test('Should return updated user', async()=>{
        userService.update = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003',
            name: 'name1', 
            email: 'email1@email.com', 
        })

        await userController.update({
            id: '123e4567-e89b-42d3-a456-426614174003', 
            body: { 
                name: 'name1', 
                email: 'email@email.com'
            }}, response);

        expect(response.json).toHaveBeenCalledWith({
            id: '123e4567-e89b-42d3-a456-426614174003',
            name: 'name1', 
            email: 'email1@email.com', 
        })
    })
})

describe('Test delete', ()=>{
    test('Should return 200', async()=>{
        userService.deleteUser = jest.fn().mockResolvedValue();
    
        await userController.delete({id: '123e4567-e89b-42d3-a456-426614174003'}, response);

        expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status)
    })
})
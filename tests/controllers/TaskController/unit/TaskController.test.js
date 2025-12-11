const taskService = require('../../../../src/app/services/taskService/taskService')
const tasKController = require('../../../../src/app/controllers/TaskController/taskController')
let response

beforeEach(() => {
        response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
});


describe('Test index', ()=>{
    test('Should return 200 and tasks', async()=>{
        taskService.findAll = jest.fn().mockResolvedValue([
            {id: '123e4567-e89b-42d3-a456-426614174002', title: 'title', description: 'description'},
            {id: '123e4567-e89b-42d3-a456-426614174003', title: 'title2', description: 'description2'}
        ])
        await tasKController.index({}, response);

        expect(response.json).toHaveBeenCalledWith([
            {id: '123e4567-e89b-42d3-a456-426614174002', title: 'title', description: 'description'},
            {id: '123e4567-e89b-42d3-a456-426614174003', title: 'title2', description: 'description2'}
        ])
    })
})

describe('Test show', ()=>{
    test('Should return task', async()=>{
        taskService.getTask = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174003',
                title: 'title2', 
                description: 'description2'
            })
    
        await tasKController.show({ params: {id: '123e4567-e89b-42d3-a456-426614174003'}}, response);

        expect(response.json).toHaveBeenCalledWith({
                id: '123e4567-e89b-42d3-a456-426614174003',
                title: 'title2', 
                description: 'description2'
            })

    })
}) 


describe('Test store', ()=>{
    test('Should return task created', async()=>{
        taskService.create = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174003',
                title: 'title2', 
                description: 'description2'
        })

        await tasKController.store({body: {title: 'title2', description: 'description2'}}, response);

        expect(response.json).toHaveBeenCalledWith({
                id: '123e4567-e89b-42d3-a456-426614174003',
                title: 'title2', 
                description: 'description2'
        })
        
    })
})

describe('Test update', ()=>{
    test('Should return task updated', async()=>{
        taskService.update = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174003',
                title: 'title2', 
                description: 'description2'
        })

        await tasKController.update({
            params: 
                { id: '123e4567-e89b-42d3-a456-426614174003'}, 
            body: 
                { title: 'title2', description: 'description2'}
        }, response);

        expect(response.json).toHaveBeenCalledWith({
                id: '123e4567-e89b-42d3-a456-426614174003',
                title: 'title2', 
                description: 'description2'
        })
    })
})

describe('Test delete', ()=>{
    test('Should return 200', async()=>{
        taskService.deleteTask = jest.fn().mockResolvedValue();

        await tasKController.delete({params: {id: '123e4567-e89b-42d3-a456-426614174003'}}, response);

        expect(response.status).toHaveBeenCalledWith(200)
    })
})
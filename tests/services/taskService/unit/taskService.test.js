jest.mock('../../../../src/app/utils/validators/isValidUUid/isValidUUID', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/helpers/generateUUID', ()=> jest.fn())

const isValidUUID = require('../../../../src/app/utils/validators/isValidUUid/isValidUUID');
const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams');
const generateUUID = require('../../../../src/app/utils/helpers/generateUUID');

const TaskRepository = require('../../../../src/app/repositories/TaskRepository/TaskRepository')
const taskService = require('../../../../src/app/services/taskService/taskService');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');

describe('Test findAll', ()=>{
    test('Should return 204 No Content', async()=>{
        TaskRepository.findAll = jest.fn().mockResolvedValue([]);

        await expect(taskService.findAll()).rejects.toMatchObject({
            message: responsesHTTP.NO_CONTENT.message,
            statusCode: responsesHTTP.NO_CONTENT.status
        })
    })

    test('Should return 200', async()=>{
        TaskRepository.findAll = jest.fn().mockResolvedValue([
            {title: 'title1', description: 'description'}, 
            {title: 'title2', description: 'description'}
        ])

        const response = await taskService.findAll();

        expect(response).toEqual([            
            {title: 'title1', description: 'description'}, 
            {title: 'title2', description: 'description'}
        ])
    })
})

describe('Test getTask', ()=>{
    test('Should return 400 Bad Request if id is invalid', async()=>{
        isValidUUID.mockReturnValue(false);

        await expect(taskService.getTask({params: { id: 1 } } )).rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 404 if id not exist', async()=>{
        isValidUUID.mockReturnValue(true);
        TaskRepository.findById = jest.fn().mockResolvedValue(null);

        await expect(taskService.getTask({ params: { id: '123e4567-e89b-42d3-a456-426614174000' }}))
        .rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })
    })

    test('Should return task', async()=>{
        isValidUUID.mockResolvedValue(true);
        TaskRepository.findById = jest.fn().mockResolvedValue({title: 'title2', description: 'description'});

        const response = await taskService.getTask({ params: { id: '123e4567-e89b-42d3-a456-426614174001' }});

        expect(response).toEqual({title: 'title2', description: 'description'});
    })
})

describe('Test create', ()=>{
    test('Should return error 400 title is required', async()=>{
        verifyParams.mockReturnValue({valid: false, message: {error: 'Title is required.'}});

        await expect(taskService.create({body: { title: '', description: 'description'}, id: '123e4567-e89b-42d3-a456-426614174010'}))
        .rejects.toMatchObject({
            message: {error: 'Title is required.'},
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return task created', async()=>{
        verifyParams.mockReturnValue({valid: true});
        generateUUID.mockReturnValue('123e4567-e89b-42d3-a456-426614174001')
        TaskRepository.create = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174001',
            title: 'title',
            description: 'description',
            user_id: '123e4567-e89b-42d3-a456-426614174010'
        })

        const response = await taskService.create({body: { title: 'title', description: 'description'}, id: '123e4567-e89b-42d3-a456-426614174010'});

        expect(response).toEqual({
            id: '123e4567-e89b-42d3-a456-426614174001',
            title: 'title',
            description: 'description',
            user_id: '123e4567-e89b-42d3-a456-426614174010',
        })
    })

})

describe('Test update', ()=>{
    test('Should return 400 if id is invalid', async()=>{
        isValidUUID.mockReturnValue(false);

        await expect(taskService.update({
            params: {id: 1}, 
            body: {title: 'title', description: 'description'}
        })).rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 400 and title is required if title is empty', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: false, message: {error: 'Title is required.'}})

        await expect(taskService.update({
            params: {id: '123e4567-e89b-42d3-a456-426614174001'}, 
            body: {title: 'title', description: 'description'}
        })).rejects.toMatchObject({
            message: {error: 'Title is required.'},
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

     test('Should return 404 if id not exists', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue(null)

        await expect(taskService.update({
            params: {id: '123e4567-e89b-42d3-a456-426614174001'}, 
            body: {title: 'title', description: 'description'}
        })).rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })
    })
    
         test('Should return 404 if id not exists', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003',
            title: 'title', 
            description: 'description'
        })
        TaskRepository.update = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003',
            title: 'title2', 
            description: 'description2'
        })

        const response = await taskService.update({
            params: {id: '123e4567-e89b-42d3-a456-426614174003'}, 
            body: {title: 'title2', description: 'description2'}
        })

        expect(response).toEqual({
            id: '123e4567-e89b-42d3-a456-426614174003',
            title: 'title2', 
            description: 'description2'
        })
    })   

    test('Should return 404 if user_id are diferent request.id', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue(null)

        await expect(taskService.update({
            id: '985e4567-e94b-42d3-a456-426614174894',
            params: {id: '123e4567-e89b-42d3-a456-426614174003'}, 
            body: {title: 'title', description: 'description'}
        })).rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })
    })
})

describe('Test deleteTask', ()=>{
    test('Should return 400 if id is invalid', async()=>{
        isValidUUID.mockReturnValue(false);

        await expect(taskService.deleteTask({params: { id: 1}})).rejects.toMatchObject({
            message: responsesHTTP.BAD_REQUEST.message,
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should return 404 if id not exist', async()=>{
        isValidUUID.mockReturnValue(true);
        TaskRepository.findById = jest.fn().mockResolvedValue(null);

        await expect(taskService.deleteTask({params: {id: '123e4567-e89b-42d3-a456-426614174003'}})).rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })
    })

    test('Should return without errors', async()=>{
        isValidUUID.mockReturnValue(true);
        TaskRepository.findById = jest.fn().mockResolvedValue({
            id: '123e4567-e89b-42d3-a456-426614174003',
            title: 'title2', 
            description: 'description2'
        })
        TaskRepository.delete = jest.fn().mockResolvedValue(1);

        await expect(taskService.deleteTask({ params: { id: '123e4567-e89b-42d3-a456-426614174003' }})).resolves.not.toThrow();

    })

    
    test('Should return 401 unauthorized if user_id are different of request.id', async()=>{
        isValidUUID.mockReturnValue(true);
        TaskRepository.findById = jest.fn().mockResolvedValue(null)

        await expect(taskService.deleteTask({ 
            id: '985e4567-e89b-42d3-a456-4266141748794',
            params: { id: '123e4567-e89b-42d3-a456-426614174003' }})).rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })

    })
})
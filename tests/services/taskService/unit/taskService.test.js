jest.mock('../../../../src/app/utils/validators/isValidUUid/isValidUUID', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
jest.mock('../../../../src/app/utils/helpers/generateUUID', ()=> jest.fn())
// jest.mock('../../../../src/app/domain/Task/taskStatus', ()=> jest.fn())
jest.mock('../../../../src/app/utils/validators/isValidDate/isValidDate', ()=> jest.fn())

const isValidUUID = require('../../../../src/app/utils/validators/isValidUUid/isValidUUID');
const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams');
const generateUUID = require('../../../../src/app/utils/helpers/generateUUID');
const taskStatus = require('../../../../src/app/domain/Task/taskStatus');
const isValidDate = require('../../../../src/app/utils/validators/isValidDate/isValidDate');

const TaskRepository = require('../../../../src/app/repositories/TaskRepository/TaskRepository')
const taskService = require('../../../../src/app/services/taskService/taskService');
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');

beforeEach(()=>{
    jest.clearAllMocks()
})


describe('Test findAll', ()=>{
    test('It should return 204 if the user has no tasks created or if there are no tasks with a user_id matching the authenticated user.',
        async()=>{
        TaskRepository.findAll = jest.fn().mockResolvedValue({tasks: [], pagination:{}});

        await expect(taskService.findAll({id: '123e4567-e89b-42d3-a456-426614174000', query: {}})).rejects.toMatchObject({
            message: responsesHTTP.NO_CONTENT.message,
            statusCode: responsesHTTP.NO_CONTENT.status
        })
    })

    test('Should return 200', async()=>{
        TaskRepository.findAll = jest.fn().mockResolvedValue({tasks: [
            {title: 'title1', description: 'description'}, 
            {title: 'title2', description: 'description'}
        ], pagination:{}})

        const response = await taskService.findAll({id: '123e4567-e89b-42d3-a456-426614174000', query:{}});

        expect(response).toEqual({tasks: [
            {title: 'title1', description: 'description'}, 
            {title: 'title2', description: 'description'}
        ], pagination:{}})
    })

    test('It should return 400 if priority contains something other than ASC or DESC.', async()=>{
        await expect(taskService.findAll({ id: '123e4567-e89b-42d3-a456-426614174000', query: { order: 'banana' } })).rejects.toMatchObject(
            {
                message: '{ error: The priority must contain only one of the two parameters, "ASC" or "DESC".}',
                statusCode: responsesHTTP.BAD_REQUEST.status
            }
        )
    })

    test('It should return 400 if the status is not within the accepted workflow.', async()=>{
        await expect(taskService.findAll({ id: '123e4567-e89b-42d3-a456-426614174000', query: { status: 'banana' } })).rejects.toMatchObject(
            {
                message: `{ error: Status allowed are ${Object.values(taskStatus.TASK_STATUS)} }`,
                statusCode: responsesHTTP.BAD_REQUEST.status
            }
        )
    })

    test('Should return 400 if date_start or date_end is invalid', async()=>{
        isValidDate.mockReturnValue({isValid: false})

        await expect(taskService.findAll({ 
            id: '123e4567-e89b-42d3-a456-426614174000', 
            query: { date_start: 'banana' } 
        })).rejects.toMatchObject(
            {
                message: '{ error: Date is invalid. Correct format YYYY-MM-DD }',
                statusCode: responsesHTTP.BAD_REQUEST.status
            }
        )

    
        await expect(taskService.findAll({ 
            id: '123e4567-e89b-42d3-a456-426614174000', 
            query: { date_end: 'banana' } 
        })).rejects.toMatchObject(
            {
                message: '{ error: Date is invalid. Correct format YYYY-MM-DD }',
                statusCode: responsesHTTP.BAD_REQUEST.status
            }
        )

        await expect(taskService.findAll({ 
            id: '123e4567-e89b-42d3-a456-426614174000', 
            query: { date_end: '23-02-2025' } 
        })).rejects.toMatchObject(
            {
                message: '{ error: Date is invalid. Correct format YYYY-MM-DD }',
                statusCode: responsesHTTP.BAD_REQUEST.status
            }
        )
    })

    test('Should verify if TaskRepository.findAll are called correct', async()=>{
        jest.spyOn(TaskRepository, 'findAll').mockResolvedValue({tasks: [{id: 'fake'}], pagination:{}});

        await taskService.findAll({            
            id: '123e4567-e89b-42d3-a456-426614174000', 
            query: { search: '', status: '', priority: '', date_start: '', date_end: '', order: '' } 
        })

        expect(TaskRepository.findAll).toHaveBeenCalledWith(
            '123e4567-e89b-42d3-a456-426614174000',
            expect.objectContaining({ 
                search: null,
                status: [],
                order: null,
                date_start: null,
                date_end: null
            }),
            expect.objectContaining({limit: 10, page: 1})
        )
    })

    test('It should be verified whether TaskRepository.findAll is being called correctly even if order is passed in lowercase.', 
            async()=>{
        jest.spyOn(TaskRepository, 'findAll').mockResolvedValue({tasks: [{id: 'fake'}], pagination:{}});

        await taskService.findAll({            
            id: '123e4567-e89b-42d3-a456-426614174000', 
            query: { search: '', status: '', priority: '', date_start: '', date_end: '', order: 'asc' } 
        })

        expect(TaskRepository.findAll).toHaveBeenCalledWith(
            '123e4567-e89b-42d3-a456-426614174000',
            expect.objectContaining({ 
                search: null,
                status: [],
                order: 'ASC',
                date_start: null,
                date_end: null
            }),
            expect.objectContaining({limit: 10, page: 1})
        )
    })

    test('Should return 400 and type of limit and page must be a number', async()=>{
        await expect(taskService.findAll({id: '123e4567-e89b-42d3-a456-426614174000', query: {limit: 'abc'}}))
        .rejects.toMatchObject({
            message:'{ error: The limit must be of type number.}', 
            statusCode: responsesHTTP.BAD_REQUEST.status
        })

        await expect(taskService.findAll({id: '123e4567-e89b-42d3-a456-426614174000', query: {page: 'abc'}}))
        .rejects.toMatchObject({
            message:'{ error: The page must be of type number.}', 
            statusCode: responsesHTTP.BAD_REQUEST.status
        })
    })

    test('Should send 100 as the maximum limit instead of letting the user exceed the limit.', async()=>{
        jest.spyOn(TaskRepository, 'findAll').mockResolvedValue({tasks: [{id: 'fake'}], pagination:{}});

        await taskService.findAll({            
            id: '123e4567-e89b-42d3-a456-426614174000', 
            query: { search: '', status: '', priority: '', date_start: '', date_end: '', limit: 200 } 
        })

        expect(TaskRepository.findAll).toHaveBeenCalledWith(
            '123e4567-e89b-42d3-a456-426614174000',
            expect.objectContaining({ 
                search: null,
                status: [],
                order: null,
                date_start: null,
                date_end: null
            }),
            expect.objectContaining({limit: 100, page: 1})
        )
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

    test('Should return 404 if task exist, but created by different user', async()=>{
        isValidUUID.mockResolvedValue(true);
        TaskRepository.findById = jest.fn().mockResolvedValue(null);

        await expect(taskService.getTask({ 
            id: '498e4567-e89b-42d3-a456-426614174983', 
            params: { id: '123e4567-e89b-42d3-a456-426614174000' }}))
        .rejects.toMatchObject({
            message: responsesHTTP.NOT_FOUND.message,
            statusCode: responsesHTTP.NOT_FOUND.status
        })  
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
            user_id: '123e4567-e89b-42d3-a456-426614174010',
            status: 'not_started',
        })

        const response = await taskService.create({body: { title: 'title', description: 'description'}, id: '123e4567-e89b-42d3-a456-426614174010'});

        expect(response).toEqual({
            id: '123e4567-e89b-42d3-a456-426614174001',
            title: 'title',
            description: 'description',
            user_id: '123e4567-e89b-42d3-a456-426614174010',
            status: 'not_started'
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

describe('Test updateStatusTask', ()=>{
    test('Should return 400 if id is invalid', async()=>{
        isValidUUID.mockReturnValue(false);

        await expect(
            taskService.updateStatusTask({
                id: '123e4567-e89b-42d3-a456-426614174003',
                params: {id: 1},
                body: {
                    nextStatus: 'in_progress'
                } 
            })).rejects.toMatchObject({
                message: responsesHTTP.BAD_REQUEST.message,
                statusCode: responsesHTTP.BAD_REQUEST.status
            })
    })

    test('Should return 400 if nextStatus is empty', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: false, message: {error: 'nextStatus is required.'}})

        await expect(
            taskService.updateStatusTask({
                id: '123e4567-e89b-42d3-a456-426614174003',
                params: {id: '985e4567-e94b-42d3-a456-426614174894'},
                body: {
                    nextStatus: ''
                } 
            })).rejects.toMatchObject({
                message: {error: 'nextStatus is required.'},
                statusCode: responsesHTTP.BAD_REQUEST.status
            })
    })

    test('Should return 404 if task not found]', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue(null);

        await expect(
            taskService.updateStatusTask({
                id: '123e4567-e89b-42d3-a456-426614174003',
                params: {id: '985e4567-e94b-42d3-a456-426614174894'},
                body: {
                    nextStatus: 'in_progress'
                } 
            })).rejects.toMatchObject({
                message: responsesHTTP.NOT_FOUND.message,
                statusCode: responsesHTTP.NOT_FOUND.status
            })
    })

    test('Should return 422 if nextStatus is invalid', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue({
            id: "f36b1782-be03-4782-ab46-50e87fd6c564",
            title: "title",
            description: "description",
            created_at: "2026-01-06T23:12:32.835Z",
            updated_at: null,
            user_id: "ad0ec5f7-c960-4569-af33-43fd41aa8bb2",
            status: "finish"
        });
        taskStatus.canTransition = jest.fn().mockResolvedValue({
            isAllowed: false,
            message: 'Unknown current status "finish".',
            allowed: null,
        });

        await expect(
            taskService.updateStatusTask({
                id: 'ad0ec5f7-c960-4569-af33-43fd41aa8bb2',
                params: {id: 'f36b1782-be03-4782-ab46-50e87fd6c564'},
                body: {
                    nextStatus: 'in_progress'
                } 
            })).rejects.toMatchObject({
                message: 'Unknown current status "finish".',
                statusCode: responsesHTTP.UNPROCESSABLE_ENTITY.status
            })
    })

    test('Should return 400 if nextStatus does not respect the workflow.', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue({
            id: "f36b1782-be03-4782-ab46-50e87fd6c564",
            title: "title",
            description: "description",
            created_at: "2026-01-06T23:12:32.835Z",
            updated_at: null,
            user_id: "ad0ec5f7-c960-4569-af33-43fd41aa8bb2",
            status: "not_started"
        });
        taskStatus.canTransition = jest.fn().mockReturnValue({
            isAllowed: false,
            message: `Cannot transition "not_started" to "done"`,
            allowed: ["in_progress"],
        });

        await expect(
            taskService.updateStatusTask({
                id: 'ad0ec5f7-c960-4569-af33-43fd41aa8bb2',
                params: {id: 'f36b1782-be03-4782-ab46-50e87fd6c564'},
                body: {
                    nextStatus: 'done'
                } 
            })).rejects.toMatchObject({
                message: `Cannot transition "not_started" to "done"`,
                statusCode: responsesHTTP.BAD_REQUEST.status,
                allowed: ["in_progress"],
            })
    })   
    test('Should return status updated', async()=>{
        isValidUUID.mockReturnValue(true);
        verifyParams.mockReturnValue({valid: true});
        TaskRepository.findById = jest.fn().mockResolvedValue({
            id: "f36b1782-be03-4782-ab46-50e87fd6c564",
            title: "title",
            description: "description",
            created_at: "2026-01-06T23:12:32.835Z",
            updated_at: null,
            user_id: "ad0ec5f7-c960-4569-af33-43fd41aa8bb2",
            status: "not_started"
        });
        taskStatus.canTransition = jest.fn().mockReturnValue({
            isAllowed: true
        });

        TaskRepository.updateStatus = jest.fn().mockResolvedValue({
            id: "f36b1782-be03-4782-ab46-50e87fd6c564",
            title: "title",
            description: "description",
            created_at: "2026-01-06T23:12:32.835Z",
            updated_at: null,
            user_id: "ad0ec5f7-c960-4569-af33-43fd41aa8bb2",
            status: "in_progress"
        })

        const respónse = await taskService.updateStatusTask({
            id: "ad0ec5f7-c960-4569-af33-43fd41aa8bb2", 
            params:{id: "f36b1782-be03-4782-ab46-50e87fd6c564"},
            body:{
                nextStatus: "in_progress"
            }
        })

        expect(respónse).toEqual({
            id: "f36b1782-be03-4782-ab46-50e87fd6c564",
            title: "title",
            description: "description",
            created_at: "2026-01-06T23:12:32.835Z",
            updated_at: null,
            user_id: "ad0ec5f7-c960-4569-af33-43fd41aa8bb2",
            status: "in_progress",
            nextAllowedStatus: ["not_started", "done"]
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
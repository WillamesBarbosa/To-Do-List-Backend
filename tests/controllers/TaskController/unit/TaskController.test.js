    jest.mock('../../../../src/app/utils/validators/isValidUUid/isValidUUID', () => jest.fn());
    jest.mock('../../../../src/app/utils/validators/verifyParams/verifyParams', ()=> jest.fn())
    const isValidUUID = require('../../../../src/app/utils/validators/isValidUUid/isValidUUID');
    const verifyParams = require('../../../../src/app/utils/validators/verifyParams/verifyParams');

    const TaskController = require('../../../../src/app/controllers/TaskController/taskController');
    const TaskRepository = require('../../../../src/app/repositories/TaskRepository/TaskRepository');
    const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');
    let response;

    beforeEach(() => {
        response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
});

    describe('Test index method in TaskController', ()=>{
        test('Should return 204 if theres is no data in database', async ()=>{
            TaskRepository.findAll = jest.fn().mockResolvedValue([]);

            await expect(TaskController.index({}, response)).rejects.toMatchObject({
                message: responsesHTTP.NO_CONTENT.message,
                statusCode: responsesHTTP.NO_CONTENT.status,
            });

        })

        test('Should return 200 and all tasks if theres is data in database', async ()=>{
            TaskRepository.findAll = jest.fn();
            TaskRepository.findAll.mockResolvedValue(
                [
                    {title: 'title1', description: 'description'}, 
                    {title: 'title2', description: 'description'}
                ]
            );

            await TaskController.index({}, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([
                    {title: 'title1', description: 'description'}, 
                    {title: 'title2', description: 'description'}
                ])
        })
    })

    describe('Test show method in TaskController', ()=>{
        test('Should return 400 if id is not valid', async()=>{
            isValidUUID.mockReturnValue(false)


            await expect(TaskController.show({params: { id: '1' }, response})).rejects.toMatchObject(
                {
                    message: responsesHTTP.BAD_REQUEST.message, 
                    statusCode: responsesHTTP.BAD_REQUEST.status
                }
            )
        })

        test('Should return 404 if theres is no id in database', async()=>{
            isValidUUID.mockReturnValue(true);
            TaskRepository.findById = jest.fn().mockResolvedValue(null)

            await expect(TaskController.show({params: { id:'123e4567-e89b-42d3-a456-426614174000' }}, response))
            .rejects.toMatchObject(
                {
                    message: responsesHTTP.NOT_FOUND.message, 
                    statusCode: responsesHTTP.NOT_FOUND.status
                }
            )
        })

        test('Should return 200 if theres is id in database', async()=>{
            TaskRepository.findById = jest.fn().mockResolvedValue(
                {
                    id:'123e4567-e89b-42d3-a456-426614174000', 
                    title: 'title',
                    description: 'description'
                });
    
            isValidUUID.mockReturnValue(true);

            await TaskController.show({ params: {id: '123e4567-e89b-42d3-a456-426614174000' }}, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(
                {
                    id:'123e4567-e89b-42d3-a456-426614174000', 
                    title: 'title',
                    description: 'description'
                }
            )
        })
    })


    describe('Test store method in TaskController', ()=>{
        test('Should return 400 if title or despcrition empty', async()=>{
            verifyParams.mockReturnValue({valid: false, message: { error: 'Title is required' } })

            await expect(TaskController.store({body: {title: '', description: ''}}, response)).rejects.toMatchObject({ 
                message:{error: 'Title is required'},
                statusCode: responsesHTTP.BAD_REQUEST.status
            });
        })

        test('Should return 201 and tasks informations', async()=>{
            verifyParams.mockReturnValue({valid: true})
            TaskRepository.create = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174000', title: 'title', description: 'description'
            });

            await TaskController.store({body: {title: 'title', description: 'description'}}, response)

            expect(response.status).toHaveBeenCalledWith(responsesHTTP.CREATED.status)
            expect(response.json).toHaveBeenCalledWith({
                id:'123e4567-e89b-42d3-a456-426614174000', title: 'title', description: 'description'
            })
        })
    })


    describe('Test update method in TaskController', ()=>{
        test('Should return 400 if id is invalid', async()=>{
            isValidUUID.mockReturnValue(false);

            await expect(TaskController.update({ 
                params: { id: '1'}, 
                body: {title: 'title', description: 'description'} }
                , response)).rejects.toMatchObject({
                message: responsesHTTP.BAD_REQUEST.message,
                statusCode: responsesHTTP.BAD_REQUEST.status
            })
        })

        test('Should return 400 if title or description is invalid', async()=>{
            isValidUUID.mockReturnValue(true);
            verifyParams.mockReturnValue({valid: false, message: {error: 'Title is required'}})

            await expect(TaskController.update({ 
                params: { id: '123e4567-e89b-42d3-a456-426614174000' }, 
                body: {title: '', description: ''} }
                , response)).rejects.toMatchObject({
                message: { error: 'Title is required'},
                statusCode: responsesHTTP.BAD_REQUEST.status
            })
        })

        test('Should return 404 if id theres is no in database', async()=>{
            isValidUUID.mockReturnValue(true);
            verifyParams.mockReturnValue({valid: true});
            TaskRepository.findById = jest.fn().mockResolvedValue(null);

            await expect(TaskController.update({
                params:{ id: '123e4567-e89b-42d3-a456-426614174000' }, 
                body: {title: 'title', description: 'description'}
            }, response)).rejects.toMatchObject({
                message: responsesHTTP.NOT_FOUND.message,
                statusCode: responsesHTTP.NOT_FOUND.status
            })
        })

        test('Should return 200 and task updated', async()=>{
            isValidUUID.mockReturnValue(true);
            verifyParams.mockReturnValue({valid: true});
            TaskRepository.update = jest.fn().mockResolvedValue({ id: '123e4567-e89b-42d3-a456-426614174000', title: 'title2', description: 'description'});
            TaskRepository.findById = jest.fn().mockResolvedValue({ id: '123e4567-e89b-42d3-a456-426614174000', title: 'title', description: 'description'});


            await TaskController.update({params: {id: '123e4567-e89b-42d3-a456-426614174000'},body: {title: 'title1', description: 'description2'}}, response);

            expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status);
            expect(response.json).toHaveBeenCalledWith(
                { id: '123e4567-e89b-42d3-a456-426614174000', title: 'title2', description: 'description'}
            )
        })
    })


    describe('Test Delete in TaskController', ()=>{
        test('Should return 400 if id is invalid', async()=>{
            isValidUUID.mockReturnValue(false);

            await expect(TaskController.delete({params: { id: 1 }}, response)).rejects.toMatchObject({
                message: responsesHTTP.BAD_REQUEST.message,
                statusCode: responsesHTTP.BAD_REQUEST.status
            })
        })

        test('Should return 404 if id theres no in database', async()=>{
            isValidUUID.mockReturnValue(true);
            TaskRepository.findById = jest.fn().mockResolvedValue(null);

            await expect(TaskController.delete({params: { id: '123e4567-e89b-42d3-a456-426614174000'}})).rejects.toMatchObject({
                message: responsesHTTP.NOT_FOUND.message,
                statusCode: responsesHTTP.NOT_FOUND.status
            })
        })

        test('Should return 200 if deleted task', async()=>{
            isValidUUID.mockReturnValue(true);
            TaskRepository.findById = jest.fn().mockResolvedValue({
                id: '123e4567-e89b-42d3-a456-426614174000', title: 'title', description: 'description'
            });
            TaskRepository.delete = jest.fn().mockResolvedValue(1)

            await TaskController.delete({params: {id: '123e4567-e89b-42d3-a456-426614174000'}}, response)

            expect(response.status).toHaveBeenCalledWith(responsesHTTP.SUCCESS.status);
            expect(response.json).toHaveBeenCalledWith(responsesHTTP.SUCCESS.message)
        })
    })
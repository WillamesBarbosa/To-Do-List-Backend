const { canTransition, TASK_STATUS_WORKFLOW, TASK_STATUS } = require("../../domain/Task/taskStatus");
const TaskRepository = require("../../repositories/TaskRepository/TaskRepository");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const generateUUID = require("../../utils/helpers/generateUUID");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const isValidDate = require("../../utils/validators/isValidDate/isValidDate");
const isValidUUID = require("../../utils/validators/isValidUUid/isValidUUID");
const verifyParams = require("../../utils/validators/verifyParams/verifyParams");

async function findAll(request){
        const userId = request.id;
        const  {
                search, 
                status, 
                order, 
                date_start, 
                date_end
        } = request.query;

        const statusToFilter = status ? status.split(',').map(s=> s.trim()) : [];
        const invalidStatus = statusToFilter.filter(s => !Object.values(TASK_STATUS).includes(s))

        const dateStart_IsValid = date_start ? isValidDate(date_start) : { isValid: false };
        const dateEnd_IsValid = date_end ? isValidDate(date_end) : {isValid: false };

        if(order && !['ASC', 'DESC'].includes(order.trim().toUpperCase())){
                throw new ErrorsHTTP(
                        '{ error: The priority must contain only one of the two parameters, "ASC" or "DESC".}', 
                        responsesHTTP.BAD_REQUEST.status
                ) 
        }

        if(status && invalidStatus.length > 0){
                throw new ErrorsHTTP(
                        `{ error: Status allowed are ${Object.values(TASK_STATUS)} }`,
                         responsesHTTP.BAD_REQUEST.status
                )
        }

        if(date_start && !dateStart_IsValid.isValid) {
                throw new ErrorsHTTP(
                        '{ error: Date is invalid. Correct format YYYY-MM-DD }',
                        responsesHTTP.BAD_REQUEST.status
                );
        }

        if(date_end && !dateEnd_IsValid.isValid) {
                throw new ErrorsHTTP(
                        '{ error: Date is invalid. Correct format YYYY-MM-DD }',
                        responsesHTTP.BAD_REQUEST.status
                );
        }
        
        const filters = {
                search: search ? search.trim() : null,
                status: statusToFilter,
                order: order && ['ASC', 'DESC'].includes(order.trim().toUpperCase())
                ? order.trim().toUpperCase()
                : null,

                date_start: dateStart_IsValid.isValid ? `${dateStart_IsValid.date} 00:00:00`  : null,
                date_end: dateEnd_IsValid.isValid ? `${dateEnd_IsValid.date} 23:59:59` : null
        }

        const task = await TaskRepository.findAll(userId, filters);
        
        if(task.length === 0) throw new ErrorsHTTP(responsesHTTP.NO_CONTENT.message, responsesHTTP.NO_CONTENT.status);

        return task
}

async function getTask(request){
        const userId = request.id;
        const { id } = request.params;
        const isIdvalid = isValidUUID(id);
        if(!isIdvalid) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status)     

        const task = await TaskRepository.findById(id, userId);
        if(!task) throw new ErrorsHTTP(responsesHTTP.NOT_FOUND.message, responsesHTTP.NOT_FOUND.status)

        return task;
}

async function create(request){
        const userId = request.id
        const {title, description} = request.body;
        
        const parameterValidation = verifyParams({ title, description })
        if(!parameterValidation.valid) throw new ErrorsHTTP(parameterValidation.message, responsesHTTP.BAD_REQUEST.status);
        
        const id = generateUUID();
        
        const task = await TaskRepository.create(id, title, description, userId);
        return task;
}

async function update(request){
        const userId = request.id;
        const { id } = request.params;
        const { title, description } = request.body;

        const isIdvalid = isValidUUID(id);
        if(!isIdvalid) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status);

        const tasksVerified = verifyParams({ title, description });
        if(!tasksVerified.valid) throw new ErrorsHTTP(tasksVerified.message, responsesHTTP.BAD_REQUEST.status);

        const taskForUpdate = await TaskRepository.findById(id, userId);
        if(!taskForUpdate) throw new ErrorsHTTP(responsesHTTP.NOT_FOUND.message, responsesHTTP.NOT_FOUND.status);

        const taskUpdated = await TaskRepository.update(id, title, description);

        return taskUpdated
}

async function updateStatusTask(request){
        const userId = request.id
        const { id } = request.params;
        const { nextStatus } = request.body;

        const isIdvalid = isValidUUID(id);
        if(!isIdvalid) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status);
        
        const tasksVerified = verifyParams({ nextStatus });
        if(!tasksVerified.valid) throw new ErrorsHTTP(tasksVerified.message, responsesHTTP.BAD_REQUEST.status);
        
        const taskForUpdateStatus = await TaskRepository.findById(id, userId);
        if(!taskForUpdateStatus) throw new ErrorsHTTP(responsesHTTP.NOT_FOUND.message, responsesHTTP.NOT_FOUND.status);
        
        const currentStatus = taskForUpdateStatus.status;
        
        const changeAllowed = canTransition(currentStatus, nextStatus);
        if(!changeAllowed.isAllowed) {
                if(!changeAllowed.allowed){
                        throw new ErrorsHTTP(changeAllowed.message, responsesHTTP.UNPROCESSABLE_ENTITY.status, { allowed: changeAllowed.allowed} );

                }

                throw new ErrorsHTTP(changeAllowed.message, responsesHTTP.BAD_REQUEST.status, { allowed: changeAllowed.allowed });
        }

        const statusTaskUpdated = await TaskRepository.updateStatus(id, nextStatus);

        const allowedResponse = {
                ...statusTaskUpdated,
                nextAllowedStatus: TASK_STATUS_WORKFLOW[nextStatus]
        }

        return allowedResponse;
}

async function deleteTask(request){
        const userId = request.id;
        const { id } = request.params;

        const isIdvalid = isValidUUID(id);
        if(!isIdvalid) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status)

        const taskForDelete = await TaskRepository.findById(id, userId);

        if(!taskForDelete) throw new ErrorsHTTP(responsesHTTP.NOT_FOUND.message, responsesHTTP.NOT_FOUND.status)

        await TaskRepository.delete(id)
}

module.exports = { 
        findAll, 
        getTask, 
        create, 
        update, 
        updateStatusTask, 
        deleteTask};
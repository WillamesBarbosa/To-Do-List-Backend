const TaskRepository = require("../../repositories/TaskRepository/TaskRepository");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const generateUUID = require("../../utils/helpers/generateUUID");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const isValidUUID = require("../../utils/validators/isValidUUid/isValidUUID");
const verifyParams = require("../../utils/validators/verifyParams/verifyParams");

async function findAll(request){
        const userId = request.id;
        const task = await TaskRepository.findAll(userId);
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
        if(!tasksVerified.valid) throw new ErrorsHTTP(tasksVerified.message, responsesHTTP.BAD_REQUEST.status)

        const taskForUpdate = await TaskRepository.findById(id, userId);
        if(!taskForUpdate) throw new ErrorsHTTP(responsesHTTP.NOT_FOUND.message, responsesHTTP.NOT_FOUND.status)

        const taskUpdated = await TaskRepository.update(id, title, description);

        return taskUpdated
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

module.exports = { findAll, getTask, create, update, deleteTask};
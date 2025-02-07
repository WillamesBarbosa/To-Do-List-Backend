const deleteTask = require("../services/deleteTask/deleteTask");
const findTaskById = require("../services/findTaskById/findTaskById");
const updateTask = require("../services/updateTask/updateTask");
const responsesHTTP = require("../utils/helpers/responsesHTTPS");
const isValidUUID = require("../utils/validators/isValidUUID");
const verifyParams = require("../utils/validators/verifyParams");
const bd = require('../../database/database');
const ErrorsHTTP = require("../utils/helpers/ErrorsHTTP");
const TaskRepository = require("../repositories/TaskRepository");


class TaskController{
    async index(request, response){
        const task = await TaskRepository.findAll();
        if(task.length === 0) throw new ErrorsHTTP(responsesHTTP.NO_CONTENT, responsesHTTP.NO_CONTENT.status);

        return response.status(responsesHTTP.SUCCESS.status).json(task);
    }

    async show(request, response){
        const { id } = request.params;
        const isIdvalid = isValidUUID(id);
        if(!isIdvalid){
            throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST, responsesHTTP.BAD_REQUEST.status)
        }        

        const task = await TaskRepository.findById(id);
        if(!task){
            throw new ErrorsHTTP(responsesHTTP.NOT_FOUND, responsesHTTP.NOT_FOUND.status)
        }

        return response.status(responsesHTTP.SUCCESS.status).json(task);
 
    }

    async store(request, response){
        const {title, description} = request.body;

        const parameterValidation = verifyParams(title, description)
        if(!parameterValidation.valid){
            throw new ErrorsHTTP(parameterValidation.message, responsesHTTP.BAD_REQUEST.status);
        }

        const task = await TaskRepository.create(title, description);

        return response.status(responsesHTTP.CREATED.status).json(task);
    }

    async update(request, response){
        const { id } = request.params;
        const {title, description} = request.body;

        const isIdvalid = isValidUUID(id);
        if(!isIdvalid){
            throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST, responsesHTTP.BAD_REQUEST.status);
        }

        const tasksVerified = verifyParams(title, description);
        if(!tasksVerified.valid){
            throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST, responsesHTTP.BAD_REQUEST.status)
        }

        const taskForUpdate = findTaskById(id, bd);

        if(!taskForUpdate){
            throw new ErrorsHTTP(responsesHTTP.NOT_FOUND, responsesHTTP.NOT_FOUND.status)
        }

        const taskUpdated = updateTask(title, description, taskForUpdate, bd);

        return response.status(responsesHTTP.SUCCESS.status).json(taskUpdated);

    }

    async delete(request, response){
        const { id } = request.params;

        const isIdvalid = isValidUUID(id);
        if(!isIdvalid){
            throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST, responsesHTTP.BAD_REQUEST.status)
        }

        const taskForDelete = findTaskById(id, bd);

        if(!taskForDelete){
            throw new ErrorsHTTP(responsesHTTP.NOT_FOUND, responsesHTTP.NOT_FOUND.status)
        }

        deleteTask(taskForDelete.index, bd);

        return response.status(responsesHTTP.SUCCESS.status).json(responsesHTTP.SUCCESS);

    }
}
module.exports = new TaskController();
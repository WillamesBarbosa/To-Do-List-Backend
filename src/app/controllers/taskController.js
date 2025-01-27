const deleteTask = require("../services/deleteTask/deleteTask");
const findTaskById = require("../services/findTaskById/findTaskById");
const updateTask = require("../services/updateTask/updateTask");
const hashGenerate = require("../utils/helpers/hashGenerate");
const responsesHTTP = require("../utils/helpers/responsesHTTPS");
const isValidHash = require("../utils/validators/isValidIdHash");
const verifyParams = require("../utils/validators/verifyParams");
const bd = require('../../database/database');
const ErrorsHTTP = require("../utils/helpers/ErrorsHTTP");


class TaskController{
    async index(request, response){
        if(bd.length === 0) throw new ErrorsHTTP(responsesHTTP.NO_CONTENT, responsesHTTP.NO_CONTENT.status);

        return response.status(responsesHTTP.SUCCESS.status).json(bd);
    }

    async store(request, response){
        const {title, description} = request.body;

        const parameterValidation = verifyParams(title, description)
        if(!parameterValidation.valid){
            throw new ErrorsHTTP(parameterValidation.message, responsesHTTP.BAD_REQUEST.status);
        }

        const obj = {id: hashGenerate(title) ,title: title, description: description};
        bd.push(obj);

        return response.status(responsesHTTP.CREATED.status).json(obj);
    }

    async update(request, response){
        const { id } = request.params;
        const {title, description} = request.body;

        const isIdvalid = isValidHash(id);
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

        const isIdvalid = isValidHash(id);
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
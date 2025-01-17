const findTaskById = require("../services/findTaskById/findTaskById");
const updateTask = require("../services/updateTask/updateTask");
const hashGenerate = require("../utils/helpers/hashGenerate");
const responsesHTTP = require("../utils/helpers/responsesHTTPS");
const isValidHash = require("../utils/validators/isValidIdHash");
const verifyParams = require("../utils/validators/verifyParams");

const bd = [];

class TaskController{
    async index(request, response){
        if(bd.length === 0) return response.status(responsesHTTP.NO_CONTENT.status).json(responsesHTTP.NO_CONTENT);
        response.status(responsesHTTP.SUCCESS.status).json(bd);
    }

    async store(request, response){
        const {title, description} = request.body;

        const parameterValidation = verifyParams(title, description)
        if(!parameterValidation.valid){
            return response.status(responsesHTTP.BAD_REQUEST.status).json(parameterValidation.message);
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
            return response.status(responsesHTTP.BAD_REQUEST.status).json(responsesHTTP.BAD_REQUEST)
        }

        const tasksVerified = verifyParams(title, description);
        if(!tasksVerified.valid){
            return response.status(responsesHTTP.BAD_REQUEST.status).json(tasksVerified.message);
        }

        const taskForUpdate = findTaskById(id, bd);

        if(!taskForUpdate){
            return response.status(responsesHTTP.NOT_FOUND.status).json(responsesHTTP.NOT_FOUND);
        }

        const taskUpdated = updateTask(title, description, taskForUpdate, bd);

        return response.status(responsesHTTP.SUCCESS.status).json(taskUpdated);

    }
}
module.exports = new TaskController();
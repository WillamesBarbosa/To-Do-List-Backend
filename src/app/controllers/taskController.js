const hashGenerate = require("../utils/helpers/hashGenerate");
const responsesHTTP = require("../utils/helpers/responsesHTTPS");
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
            return response.status(responsesHTTP.BAD_REQUEST.status).json(parameterValidation.error);
        }

        const obj = {id: hashGenerate(title) ,title: title, description: description};
        bd.push(obj);
        return response.status(responsesHTTP.CREATED.status).json(obj);
    }
}
module.exports = new TaskController();
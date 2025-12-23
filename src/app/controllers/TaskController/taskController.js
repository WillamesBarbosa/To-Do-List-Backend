
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const taskService = require('../../services/taskService/taskService')


class TaskController{
    async index(request, response){
        const task = await taskService.findAll(request)

        return response.status(responsesHTTP.SUCCESS.status).json(task);
    }

    async show(request, response){
        const task = await taskService.getTask(request)

        return response.status(responsesHTTP.SUCCESS.status).json(task);
 
    }

    async store(request, response){
        const task = await taskService.create(request)

        return response.status(responsesHTTP.CREATED.status).json(task);
    }

    async update(request, response){
        const task = await taskService.update(request)

        return response.status(responsesHTTP.SUCCESS.status).json(task);

    }

    async delete(request, response){
        await taskService.deleteTask(request)

        return response.status(responsesHTTP.SUCCESS.status).json(responsesHTTP.SUCCESS.message);

    }
}
module.exports = new TaskController();
const userService = require('../../services/userService/userService')
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");


class UserController{

    async index(request, response){
        const users = await userService.findAll()

        return response.status(responsesHTTP.SUCCESS.status).json(users);
    }

    async show(request, response){
        const user = await userService.getUser(request)

        return response.status(responsesHTTP.SUCCESS.status).json(user);
    }

    async store(request, response){
        const user = await userService.create(request)

        return response.status(responsesHTTP.CREATED.status).json(user);
    }

    async update(request, response){
        const user = await userService.update(request);

        return response.status(responsesHTTP.SUCCESS.status).json(user);

    }

    async delete(request, response){
        await userService.deleteUser(request);

        return response.status(responsesHTTP.SUCCESS.status).json(responsesHTTP.SUCCESS);

    }
}

module.exports = new UserController();
const verifyParams = require("../utils/verifyParams");

const bd = [];

class TaskController{
    async index(request, response){
        response.json({message: 'Bem-vindo à API de tarefas'});
    }

    async create(request, response){
        const {title, description} = request.body;

        const verifyAllParams = verifyParams(title, description);
        console.log(verifyAllParams)

        if(verifyAllParams){
            const obj = {title: title, description: description};
            console.log(obj)
            bd.push(obj);
            const json = JSON.stringify(obj)
            console.log(json)
            return response.json(json)
        }

        return response.json({Error: 'Titulo ou descrição vazios'})


    }
}
module.exports = new TaskController();
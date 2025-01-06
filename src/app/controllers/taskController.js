class TaskController{
    async index(request, response){
        response.json({message: 'Bem-vindo à API de tarefas'})
    }
}
module.exports = new TaskController();
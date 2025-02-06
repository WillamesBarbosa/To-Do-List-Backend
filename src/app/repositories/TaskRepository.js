const database = require("../../database/config/config-knex");

class TaskRepository{
    async findAll(){
        const rows = await database('tasks').select('*');

        return rows;
    }

    async create(title, description){
        console.log('chegou aqui')
        const data = {
            title: title,
            description: description
        }
        const [ row ] = await database('tasks').insert(data).returning('*');

        return row;
    }
}

module.exports = new TaskRepository();
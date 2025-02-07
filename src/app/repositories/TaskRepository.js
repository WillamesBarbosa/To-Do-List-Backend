const database = require("../../database/config/config-knex");

class TaskRepository{
    async findAll(){
        const rows = await database('tasks').select('*');

        return rows;
    }

    async findById(id){
        const row = await database('tasks').where('id', id);

        console.log(row)
        return row;
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
const database = require("../../../database/config/config-knex");

class TaskRepository{
    async findAll(userId){
        const rows = await database('tasks').select('*').where('user_id', userId);

        return rows;
    }

    async findById(id, userId){
        const [ row ] = await database('tasks').where('id', id).andWhere('user_id', userId);
 

        return row || null;
    }

    async create(id, title, description, userId){
        const data = {
            id: id,
            title: title,
            description: description,
            user_id: userId
        }

        const [ row ] = await database('tasks').insert(data).returning('*');

        return row;
    }

    async update(id, title, description){
        const [ row ] = await database('tasks').where('id', id).update({title: title, description: description}). returning('*');

        return row;
    }

    async delete(id){
        const row = await database('tasks').where('id', id).del();

        return row;
    }
}

module.exports = new TaskRepository();
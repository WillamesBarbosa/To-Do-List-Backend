require('dotenv').config();
const database = require("../../../database/config/config-knex");

class TaskRepository{
    async findAll(userId, filters){
        console.log('ta quebrando aqui')
        const query = database('tasks').where('user_id', userId);
        
        if(filters.search){
            if(process.env.NODE_ENV === 'test'){
                const searchLower = `%${filters.search.toLowerCase()}%`;
                query.whereRaw('LOWER(title) LIKE ?', [searchLower]);
            }else{
                query.where('title', 'ilike', `%${filters.search}%`)
            }

        }

        if(filters.status && filters.status.length > 0){
            query.whereIn('status', filters.status);
        }
        //filtro só deve funcionar se as duas datas forem definidas.
        if(filters.date_start && filters.date_end){
            console.log(filters.date_start, filters.date_end)
            query.whereBetween('created_at', [filters.date_start, filters.date_end]);
        }

        if(filters.order){
            console.log('ta quebrando aqui na query', filters.order)
            query.orderBy([
                {column: 'created_at', order: filters.order},
                {column: 'id', order: filters.order}
            ]);
        }

        return await query;
    }

    async findById(id, userId){
        const [ row ] = await database('tasks').where('id', id).andWhere('user_id', userId);
 

        return row || null;
    }

    // async findWithFilters(userId, filters = {}){
    //     const query = database('tasks').where('user_id', userId);

    //     if(filters.search){
    //         query.where('title', 'ilike', `%${filters.search}%`);
    //     }

    //     if(filters.status && filters.status.length > 0){
    //         query.whereIn('status', filters.status);
    //     }
    //     //filtro só deve funcionar se as duas datas forem definidas.
    //     if(filters.date_start && filters.date_end){
    //         query.whereBetween('created_at', [filters.date_start, filters.date_end]);
    //     }

    //     if(filters.priority){
    //         query.orderBy('created_at', filters.priority);
    //     }

    //     return query
    // }

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

    async updateStatus(id, nextStatus){
        const [ row ] = await database('tasks').where('id', id).update({status: nextStatus}).returning('*');

        return row
    }

    async delete(id){
        const row = await database('tasks').where('id', id).del();

        return row;
    }
}

module.exports = new TaskRepository();
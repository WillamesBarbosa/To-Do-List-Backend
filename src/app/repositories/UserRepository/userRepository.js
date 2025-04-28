const database = require('../../../database/config/config-knex');

class UserRepository{

    async findAll(){
        const rows = await database('users').select('*');

        return rows;
    }

    async findById(id){
        const row = await database('users').where('id', id);
        if(row.length === 0){
            return null;
        }

        return row;
    }

    async findByEmail(email){
        const row = await database('users').where('email', email);
        if(row.length === 0){
            return null;
        }

        return row;
    }

    async create(id, name, email, password){
        const data = {
            id: id, name: name, email: email, password: password,
        }

        const [ row ] = await database('users').insert(data).returning('*');
        
        return row;
    }

    async update(id, name, email, updateAt){
        const [ row ] = await database('users').where('id', id).update({name, email, updated_at: updateAt}).returning('*');

        return row;
    }
}

module.exports =  new UserRepository();
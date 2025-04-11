const database = require('../../../database/config/config-knex');

class UserRepository{

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
            id, name, email, password,
        }

        const row = await database('users').insert(data).returning('*');

        return row;
    }
}

module.exports =  new UserRepository();
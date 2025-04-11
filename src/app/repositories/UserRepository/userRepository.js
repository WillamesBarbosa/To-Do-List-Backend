const database = require('../../../database/config/config-knex');

class UserRepository{
    async create(id, name, email, password){
        const data = {
            id, name, email, password,
        }

        const row = await database('users').insert(data).returning('*');

        return row;
    }
}

module.exports =  new UserRepository();
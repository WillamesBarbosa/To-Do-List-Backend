const database = require('../../../database/config/config-knex');

class UserRepository{

    async findAll(){
        const rows = await database('users').select('*');

        return rows;
    }

    async findById(id){
        const row = await database('users').where('id', id).first();


        return row || null;
    }

    async findByEmail(email){
        const row = await database('users').where('email', email).first();

        return row || null;
    }

    async create(id, name, email, password){
        const data = {
            id: id, name: name, email: email, password: password,
        }

        const [ row ] = await database('users').insert(data).returning(['id', 'name', 'email', 'created_at']);
        
        return row;
    }

    async update(id, name, email, updateAt){
        const [ row ] = await database('users').where('id', id).update({name, email, updated_at: updateAt}).returning('*');

        return row;
    }

    
    async delete(id){
        const row = await database('users').where('id', id).del();

        return row;
    }
}

module.exports =  new UserRepository();
const request = require('supertest');
const app = require('../../../../src/index');
const database = require('../../../../src/database/config/config-knex');
const createUserTokenToTest = require('../../../../src/app/utils/helpers/createUserTokenToTest/createUserTokenToTest');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable');

beforeAll(async() => {

    await database.schema.createTable('tasks', (table) => {
      table.text('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.text('user_id').notNullable();
      table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    });

    await generateTable('users');

  });

  beforeEach(async() => {
    await database('tasks').del();
    await database('users').del();
  });
  
  afterAll(async() => {
    await database.destroy();
  });

const userToJWT = {
    name: 'name',
    email: 'email@email.com',
    password: '123456'
}

const userToJWT2 ={
    name: 'name1',
    email: 'email1@email.com',
    password: '123456'
}

describe('TaskController index tests', ()=>{
    test('Should return 204 if bd equals 0', async()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT);

        const response = await request(server).get('/tasks').set('Authorization', `Bearer ${token.token}`);

    
        expect(response.status).toEqual(204)
    })


    test('Should return 201 and a series of tasks', async()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)

        await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        const response = await request(server).get('/tasks').set('Authorization', `Bearer ${token.token}`);


        const [ { id } ] = response.body;
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([{id: id, title: 'titulo', description: 'descricao', user_id: `${token.id}`}]);

    })

    test('Should return 204 not found if userId are different request.id', async()=>{
        const server = app;
        const user1 = await createUserTokenToTest(app, userToJWT);
        const user2 = await createUserTokenToTest(app, userToJWT2);
        await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${user1.token}`);

        const response = await request(server).get('/tasks').set('Authorization', `Bearer ${user2.token}`);
        
        expect(response.status).toEqual(204)
    })
})


describe('TaskController show tests', ()=>{
    test('Should return 400 because the id is invalid', async()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)
        const response = await request(server).get('/task/123456').set('Authorization', `Bearer ${token.token}`)
        expect(response.status).toEqual(400);
    })


    test('Should return 201 because id exists', async()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)

    
        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        const id = response.body.id;

        const requisition = await request(server).get('/task' + '/' + id).set('Authorization', `Bearer ${token.token}`);
        expect(requisition.status).toEqual(200)
    })

    test('Should return 404 if task does not exists', async()=>{
        const server = app;
        const identification = '40833333-521b-4cfe-860d-224c0330e87a';
        const token = await createUserTokenToTest(app, userToJWT)

        const requisition = await request(server).get('/task' + '/' + identification).set('Authorization', `Bearer ${token.token}`);
        expect(requisition.status).toEqual(404);
    })

    test('Should return 404 if task exist, but created by different user', async()=>{
        const server = app;
        const user1 = await createUserTokenToTest(app, userToJWT);
        const user2 = await createUserTokenToTest(app, userToJWT2);

        await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${user1.token}`);

        const createTask = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${user2.token}`);

        const response = await request(server).get('/task' + '/' + createTask.body.id).set('Authorization', `Bearer ${user1.token}`);


        expect(response.status).toEqual(404);
    })
})


describe('TaskController store tests', ()=>{
    test('Should return status 201, description and title', async()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT);
        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('title', 'titulo');
        expect(response.body).toHaveProperty('description', 'descricao');
        expect(response.body).toHaveProperty('user_id', `${token.id}`);
    })


    test('Should return status 400 and error Title is required', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT);
        const response = await request(server).post('/task').send({title: '', description: 'description'})
        .set('Authorization', `Bearer ${token.token}`);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({error: 'Title is required.'});
        
    })

    test('Should return status 400 and error Description is required', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT);
        
        const response = await request(server).post('/task').send({title: 'title', description: ''})
        .set('Authorization', `Bearer ${token.token}`);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ error: 'Description is required.'});
        
    })

    test('Should return the created object without the extra property', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT);

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao', extraArg: 'Something'})
        .set('Authorization', `Bearer ${token.token}`);
    
        expect(response.body).toHaveProperty('title', 'titulo');
        expect(response.body).toHaveProperty('description', 'descricao');
        expect(response.body).not.toHaveProperty('extraArg', 'something');

    })
})

describe('TaskController update tests', ()=>{
    test('Should return the updated object', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);
        
        const taskUpdated = await request(server).put('/task/'+response._body.id).send({title: 'titulo2', description: 'descricao2'})
        .set('Authorization', `Bearer ${token.token}`);
        expect(taskUpdated.body).toHaveProperty('id', response._body.id);
        expect(taskUpdated.body).toHaveProperty('title', 'titulo2');
        expect(taskUpdated.body).toHaveProperty('description', 'descricao2');
        expect(taskUpdated.body).toHaveProperty('user_id', `${token.id}`);

    })


    test('Should return error 400 because id invalid', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        response._body.id = null;

        const taskUpdated = await request(server).put('/task/'+response._body.id).send({title: 'titulo2', description: 'descricao2'})
        .set('Authorization', `Bearer ${token.token}`);

        expect(taskUpdated.status).toEqual(400);

    })

    test('Should return error 400 because title or description is invalid', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        const taskUpdatedWithTitleEmpty = await request(server).put('/task/'+response._body.id)
        .send({title: '', description: 'descricao2'}).set('Authorization', `Bearer ${token.token}`);

        const taskUpdatedWithDescriptionEmpty = await request(server).put('/task/'+response._body.id).send({title: 'titulo', description: ''})
        .set('Authorization', `Bearer ${token.token}`);


        expect(taskUpdatedWithTitleEmpty.status).toEqual(400);
        expect(taskUpdatedWithDescriptionEmpty.status).toEqual(400);

    })   

    test('Should return error 404 because id not exist', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);
        response._body.id = '8d888880-c4c0-4ef6-8258-c8dc35baaec7'
        const taskUpdated = await request(server).put('/task/'+response._body.id).send({title: 'titulo', description: 'descricao2'})
        .set('Authorization', `Bearer ${token.token}`);


        expect(taskUpdated.status).toEqual(404);
    })
    
    test('Should return 404 if user_id are diferent request.id', async()=>{
        const server = app;
        const user1 = await createUserTokenToTest(app, userToJWT);
        const user2 = await createUserTokenToTest(app,userToJWT2);

        await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${user1.token}`);

        const task2 = await request(server).post('/task').send({title: 'titulo2', description: 'descricao2'})
        .set('Authorization', `Bearer ${user2.token}`);


        const taskUpdated = await request(server).put('/task/'+task2._body.id).send({title: 'titulo', description: 'descricao2'})
        .set('Authorization', `Bearer ${user1.token}`); 
        
        expect(taskUpdated.status).toEqual(404);
    })
})


describe('TaskController delete tests', ()=>{
    test('Should return an array and have deleted the correct task', async ()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT)


        await request(server).post('/task').send({title: 'titulo1', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);
        const objForDelete = await request(server).post('/task').send({title: 'titulo2', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);
        await request(server).post('/task').send({title: 'titulo3', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        await request(server).delete('/task/'+objForDelete._body.id).set('Authorization', `Bearer ${token.token}`);


        const checkIfTaskWasDeletedCorrectly = await request(server).get('/tasks').set('Authorization', `Bearer ${token.token}`);

        expect(checkIfTaskWasDeletedCorrectly.body).toHaveLength(2);
    })
    
    test('should return status 200', async ()=>{
        const server = app;

        const token = await createUserTokenToTest(app, userToJWT)

        await request(server).post('/task').send({title: 'titulo1', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);
        const objForDelete = await request(server).post('/task').send({title: 'titulo2', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);
        await request(server).post('/task').send({title: 'titulo3', description: 'descricao'})
        .set('Authorization', `Bearer ${token.token}`);

        const objDeleted = await request(server).delete('/task/'+objForDelete._body.id).set('Authorization', `Bearer ${token.token}`);
        expect(objDeleted.status).toEqual(200);

    })

    test('Should return 400 because the id is invalid', async()=>{
        const server = app;

        const token = await createUserTokenToTest(app, userToJWT)
        
        const response = await request(server).delete('/task/123456').set('Authorization', `Bearer ${token.token}`);
        
        expect(response.status).toEqual(400);
    })
    
    test('Should return 404 if task does not exists', async()=>{
        const server = app;
        const token = await createUserTokenToTest(app, userToJWT);
        const identification = '40833333-521b-4cfe-860d-224c0330e87a';

        
        const requisition = await request(server).delete('/task' + '/' + identification).set('Authorization', `Bearer ${token.token}`);
        expect(requisition.status).toEqual(404);
    })

    test('Should return 404 not found if userId are different request.id', async()=>{
        const server = app;
        const user1 = await createUserTokenToTest(app, userToJWT);
        const user2 = await createUserTokenToTest(app, userToJWT2);

        const objForDelete = await request(server).post('/task').send({title: 'titulo', description: 'descricao'})
        .set('Authorization', `Bearer ${user1.token}`);
        const objDeleted = await request(server).delete('/task/'+objForDelete._body.id).set('Authorization', `Bearer ${user2.token}`);
        
        expect(objDeleted.status).toEqual(404);

    })
})
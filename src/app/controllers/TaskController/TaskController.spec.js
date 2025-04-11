const request = require('supertest');
const app = require('../../../index');
const database = require('../../../../src/database/config/config-knex');

beforeAll(() => {

    return database.schema.createTable('tasks', (table) => {
      table.text('id').primary();
      table.string('title').notNullable();
      table.text('description');
    });
  });

  beforeEach(() => {
    return database('tasks').del();
  });
  
  afterAll(() => {
    return database.destroy();
  });

describe('TaskController index tests', ()=>{
    test('Should return 204 if bd equals 0', async()=>{
        const server = app;
        const response = await request(server).get('/tasks')
    
        expect(response.status).toEqual(204)
    })


    test('Should return 201 and a series of tasks', async()=>{
        const server = app;

        await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        const response = await request(server).get('/tasks');
        const [ {id} ] = response.body;
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([{id: id, title: 'titulo', description: 'descricao'}]);

    })
})


describe('TaskController show tests', ()=>{
    test('Should return 400 because the id is invalid', async()=>{
        const server = app;
        const response = await request(server).get('/task/123456');
    
        expect(response.status).toEqual(400);
    })


    test('Should return 201 because id exists', async()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        const id = response.body.id;
        const requisition = await request(server).get('/task' + '/' + id);
        expect(requisition.status).toEqual(200)
    })

    test('Should return 404 if task does not exists', async()=>{
        const server = app;
        const identification = '40833333-521b-4cfe-860d-224c0330e87a';

        const requisition = await request(server).get('/task' + '/' + identification);
        expect(requisition.status).toEqual(404);
    })
})


describe('TaskController store tests', ()=>{
    test('Should return status 201, description and title', async()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('title', 'titulo');
        expect(response.body).toHaveProperty('description', 'descricao');
    })


    test('Should return status 400 and error Title is required', async ()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: '', description: 'description'});

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error', 'Title is required.');
        
    })

    test('Should return status 400 and error Description is required', async ()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'title', description: ''});

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error', 'Description is required.');
        
    })

    test('Should return the created object without the extra property', async ()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao', extraArg: 'Something'});
    
        expect(response.body).toHaveProperty('title', 'titulo');
        expect(response.body).toHaveProperty('description', 'descricao');
        expect(response.body).not.toHaveProperty('extraArg', 'something');

    })
})

describe('TaskController update tests', ()=>{
    test('Should return the updated object', async ()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        console.log('vamos ver o id', response._body.id)
        
        const taskUpdated = await request(server).put('/task/'+response._body.id).send({title: 'titulo2', description: 'descricao2'});
        console.log(taskUpdated._body.id)
        expect(taskUpdated.body).toHaveProperty('id', response._body.id);
        expect(taskUpdated.body).toHaveProperty('title', 'titulo2');
        expect(taskUpdated.body).toHaveProperty('description', 'descricao2');

    })


    test('Should return error 400 because id invalid', async ()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        response._body.id = null;
        const taskUpdated = await request(server).put('/task/'+response._body.id).send({title: 'titulo2', description: 'descricao2'});

        expect(taskUpdated.status).toEqual(400);

    })

    test('Should return error 400 because title or description is invalid', async ()=>{
        const server = app;

        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        const taskUpdatedWithTitleEmpty = await request(server).put('/task/'+response._body.id)
        .send({title: '', description: 'descricao2'});
        const taskUpdatedWithDescriptionEmpty = await request(server).put('/task/'+response._body.id).send({title: 'titulo', description: ''});

        expect(taskUpdatedWithTitleEmpty.status).toEqual(400);
        expect(taskUpdatedWithDescriptionEmpty.status).toEqual(400);

    })   

    test('Should return error 404 because id not exist', async ()=>{
        const server = app;
        const response = await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        response._body.id = '8d888880-c4c0-4ef6-8258-c8dc35baaec7'
        const taskUpdated = await request(server).put('/task/'+response._body.id).send({title: 'titulo', description: 'descricao2'});

        expect(taskUpdated.status).toEqual(404);
    })
    
})


describe('TaskController delete tests', ()=>{
    test('Should return an array and have deleted the correct task', async ()=>{
        const server = app;


        await request(server).post('/task').send({title: 'titulo1', description: 'descricao'});
        const objForDelete = await request(server).post('/task').send({title: 'titulo2', description: 'descricao'});
        await request(server).post('/task').send({title: 'titulo3', description: 'descricao'});

        await request(server).delete('/task/'+objForDelete._body.id);

        const checkIfTaskWasDeletedCorrectly = await request(server).get('/tasks');

        expect(checkIfTaskWasDeletedCorrectly.body).toHaveLength(2);
    })
    
    test('should return status 200', async ()=>{
        const server = app;

        await request(server).post('/task').send({title: 'titulo1', description: 'descricao'});
        const objForDelete = await request(server).post('/task').send({title: 'titulo2', description: 'descricao'});
        await request(server).post('/task').send({title: 'titulo3', description: 'descricao'});

        const objDeleted = await request(server).delete('/task/'+objForDelete._body.id);
        expect(objDeleted.status).toEqual(200);

    })

    test('Should return 400 because the id is invalid', async()=>{
        const server = app;
        const response = await request(server).delete('/task/123456');
    
        expect(response.status).toEqual(400);
    })

    test('Should return 404 if task does not exists', async()=>{
        const server = app;
        const identification = '40833333-521b-4cfe-860d-224c0330e87a';

        const requisition = await request(server).delete('/task' + '/' + identification);
        expect(requisition.status).toEqual(404);
    })
})
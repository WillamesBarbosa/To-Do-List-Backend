const request = require('supertest');

const app = require('../../index');

describe('TaskController index tests', ()=>{
    test('Should return 204 if bd equals 0', async()=>{
        const server = app;
        const response = await request(server).get('/task')
    
        expect(response.status).toEqual(204)
    })


    test('Should return 201 and a series of tasks', async()=>{
        const server = app;

        await request(server).post('/task').send({title: 'titulo', description: 'descricao'});
        const response = await request(server).get('/task');
        const [ {id} ] = response.body;
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([{id: id, title: 'titulo', description: 'descricao'}]);
        
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




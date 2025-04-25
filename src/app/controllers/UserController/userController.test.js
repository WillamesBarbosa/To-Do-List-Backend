const request = require('supertest');
const app = require('../../../index');
const database = require('../../../database/config/config-knex');

beforeAll(() => {

    return database.schema.createTable('users', (table) => {
      table.text('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(new Date());
      table.timestamp('updated_at').nullable();
    });
  });

  beforeEach(() => {
    return database('users').del();
  });
  
  afterAll(() => {
    return database.destroy();
  });

  describe('Store tests', ()=>{

    test('Should return name is required and status 400', async()=>{
        const server =  app;

        const response = await request(server).post('/user').send({ name: '', email: 'email@gmail.com', password: 'password' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ "error": "Name is required." })
    })

    test('Should return email is required and status 400', async()=>{
        const server =  app;

        const response = await request(server).post('/user').send({ name: 'name', email: '', password: 'password' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ "error": "Email is required." })
    })

    test('Should return password is required and status 400', async()=>{
        const server =  app;

        const response = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: '' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ "error": "Password is required." })
    })

    test('Should return email is invalid and status 400', async()=>{
        const server =  app;

        const response = await request(server).post('/user').send({ name: 'name', email: 'emailemail.com', password: 'password' });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ "error": "Email is invalid." })
    })

    test('Should return status 201 and user created', async()=>{
        const server =  app;

        const response = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });

        expect(response.body.name).toEqual('name');
        expect(response.body.email).toEqual('email@email.com');
    })

  })
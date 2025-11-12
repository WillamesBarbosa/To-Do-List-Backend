const request = require('supertest');
const app = require('../../../../src/index');
const database = require('../../../../src/database/config/config-knex');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable');

beforeAll(async() => {

    await generateTable('users');

  });
    
  beforeEach(async() => {
    await database('users').del();
  });
  
  afterAll(async() => {
    await database.destroy();
  });

describe('loginController tests', ()=>{
  test('should return 400 status and error message correct if email or password is undefined', async()=>{
      const server = app;
      await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' });
  
      const loginEmailUndefined = await request(server).post('/login').send({ email: '', password: 'password' })
      const loginPasswordUndefined = await request(server).post('/login').send({ email: 'email2@email.com', password: '' })
  
      expect(loginEmailUndefined.status).toEqual(400);
      expect(loginPasswordUndefined.status).toEqual(400);
      expect(loginEmailUndefined.body).toEqual({ error: 'Email is required.' });
      expect(loginPasswordUndefined.body).toEqual({ error: 'Password is required.' });
  })
  
  test('Should return 400 status and correct message if email is not valid', async()=>{
      const server = app;
      await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' });

      const login = await request(server).post('/login').send({ email: 'email2email.com', password: 'password' });

      expect(login.status).toEqual(400);
      expect(login.body).toEqual({ error: 'Email is invalid.' });
  })

   test('Should return 400 status and correct message if email is not exists', async()=>{
      const server = app;
      await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' });
    
      const login = await request(server).post('/login').send({ email: 'emaildontexist@email.com', password: 'password' });

      expect(login.status).toEqual(400);
      expect(login.body).toEqual({ error: 'Email not found.' });
  }) 

    test('Should return 400 status and correct message if password is incorrect', async()=>{
    const server = app;
    await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' });
  
    const login = await request(server).post('/login').send({ email: 'email2@email.com', password: 'passwordincorrect' });

    expect(login.status).toEqual(400);
    expect(login.body).toEqual({ error: 'Password incorrect.' });
  }) 


  test('should return status 200 and token if email exists and password is correct', async()=>{
      const server = app;

      await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' });

      const login = await request(server).post('/login').send({ email: 'email2@email.com', password: 'password' })
  
      expect(login.status).toEqual(200);
  })
})

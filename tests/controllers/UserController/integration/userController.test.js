const request = require('supertest');
const app = require('../../../../src/index');
const database = require('../../../../src/database/config/config-knex');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable');
const createUserTokenToTest = require('../../../../src/app/utils/helpers/createUserTokenToTest/createUserTokenToTest');


beforeAll(async () => {
    await generateTable('users');

  });

  beforeEach(async() => {
    await database('users').del();
  });
  
  afterAll(async() => {
    await database.destroy();
  });

  const userToJWT = {
    name: 'name',
    email: 'emailToken@email.com',
    password: '123456'
}


  describe('Index tests', ()=>{
    test('should return error 204 if not exist users', async()=>{
      const server = app;

      const response = await request(server).get('/users');

      expect(response.status).toEqual(204);
    });

    test('Should return users', async ()=>{
      const server = app;

      await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' })
      await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' })
      const response= await request(server).get('/users');

      expect(response.body.length).toEqual(2);

    })
  })

  describe('Show tests', ()=>{
    test('should return user', async()=>{
      const server = app;
      const token = await createUserTokenToTest(app, userToJWT)
      const response = await request(server).get(`/user`)
      .set('Authorization', `Bearer ${token}`);

      expect(response.body.name).toEqual('name');
    })
  })


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

    test('Should return 400 status if email already exists', async()=>{
      const server = app;

      await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });
      const response = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });

      expect(response.status).toEqual(400);
    })

    test('Should return status 201 and user created', async()=>{
        const server =  app;

        const response = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });

        expect(response.body.name).toEqual('name');
        expect(response.body.email).toEqual('email@email.com');
    })

  })

  describe('UserController update test', ()=>{

    test('Should return Name is required and status 400 ', async ()=>{
      const server = app;
      const token = await createUserTokenToTest(server, userToJWT)

      const response = await request(server).put(`/user`).send({ name: '', email: 'emaildiferenciado@email.com' })
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ "error": "Name is required."});
    })
    
    test('Should return Email is invalid and status 400 ', async ()=>{
      const server = app;
      const token = await createUserTokenToTest(app, userToJWT)
      
      const response = await request(server).put(`/user`).send({ name: 'name', email: 'emailemail.com' })
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ "error": "Email is invalid."});
    })
    
    test('Should return status 400 if email exist ', async ()=>{
      const server = app;
      const token = await createUserTokenToTest(app, userToJWT)
      
      await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });
      const response = await request(server).put('/user').send({ name: 'name', email: 'email@email.com' })
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toEqual(400);
    })
    
    test('Should return status 200 and user updated', async ()=>{
      const server = app;
      const token = await createUserTokenToTest(app, userToJWT)
            
      const response = await request(server).put('/user').send({ name: 'name2', email: 'email1@email.com' })
      .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual('email1@email.com');
      expect(response.body.name).toEqual('name2');
    })
  })

  describe('UserController delete tests', ()=>{
    test('Should return 200 if delete user', async()=>{
      const server = app;
      const token = await createUserTokenToTest(app, userToJWT)

      const objForDelete = await request(server).delete(`/user`)
      .set('Authorization', `Bearer ${token}`);

      expect(objForDelete.status).toEqual(200);

    })
  })
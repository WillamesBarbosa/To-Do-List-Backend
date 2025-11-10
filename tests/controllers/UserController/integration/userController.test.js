const request = require('supertest');
const app = require('../../../../src/index');
const database = require('../../../../src/database/config/config-knex');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable');


beforeAll(async () => {
    await generateTable('users');

  });

  beforeEach(async() => {
    await database('users').del();
  });
  
  afterAll(async() => {
    await database.destroy();
  });

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

  describe('Index tests', ()=>{
    test('should return error 400 if id is invalid', async()=>{
      const server = app;
      
      const id = 'dnskadnamskdqi'
      const response = await request(server).get(`/user/${id}`);

      expect(response.status).toEqual(400);
    });

    test('Should return status 404 if id not exist ', async ()=>{
      const server = app;

      const userid = '5e2f3333-9986-4118-98c6-d01b63692c50';

      const response = await request(server).get(`/user/${userid}`);
      expect(response.status).toEqual(404);
    })
    
    test('should return user', async()=>{
      const server = app;

      const user = await request(server).post('/user').send({ name: 'name', email: 'email2@email.com', password: 'password' })
      const id = user.body.id;
      const response = await request(server).get(`/user/${id}`);

      const userFinded = response;

      expect(userFinded.body[0].name).toEqual('name');
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
    test('Should return 400 status if id is invalid', async()=>{
      const server = app;
      
      const response = await request(server).put(`/user/${'123456'}`).send({name: 'name', email: 'email@email.com'});

      expect(response.status).toEqual(400);
    })

    test('Should return Name is required and status 400 ', async ()=>{
      const server = app;

      const user = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });
      const userid = user.body.id;
      const response = await request(server).put(`/user/${userid}`).send({ name: '', email: 'email@email.com' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ "error": "Name is required."});
    })

    test('Should return Email is invalid and status 400 ', async ()=>{
      const server = app;

      const user = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });
      const userid = user.body.id;
      const response = await request(server).put(`/user/${userid}`).send({ name: 'name', email: 'emailemail.com' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ "error": "Email is invalid."});
    })

    
    test('Should return status 404 if id not exist ', async ()=>{
      const server = app;

      await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });
      const userid = '5e2f3333-9986-4118-98c6-d01b63692c50';

      const response = await request(server).put(`/user/${userid}`).send({ name: 'name', email: 'email@email.com' });
      expect(response.status).toEqual(404);
    })

    test('Should return status 400 if email exist ', async ()=>{
      const server = app;

      const user = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });

      const response = await request(server).put('/user/'+user.body.id).send({ name: 'name', email: 'email@email.com' });

      expect(response.status).toEqual(400);
    })

    test('Should return status 200 and user updated', async ()=>{
      const server = app;

      const user = await request(server).post('/user').send({ name: 'name', email: 'email@email.com', password: 'password' });

      const response = await request(server).put('/user/'+user.body.id).send({ name: 'name2', email: 'email1@email.com' });

      expect(response.status).toEqual(200);
      expect(response.body.email).toEqual('email1@email.com');
      expect(response.body.name).toEqual('name2');
    })
  })

  describe('UserController delete tests', ()=>{
    test('Should return 400 status if id is invalid', async()=>{
      const server = app;
      
      const response = await request(server).delete(`/user/${'123456'}`);

      expect(response.status).toEqual(400);
    })

    test('Should return 404 status if not find id', async()=>{
      const server = app;

      const userid = '5e2f3333-9986-4118-98c6-d01b63692c50';

      const response = await request(server).delete(`/user/${userid}`);

      expect(response.status).toEqual(404);
    })

    test('Should return 200 if delete user', async()=>{
      const server = app;

      const response = await request(server).post('/user').send({name: 'name', email: 'email@email.com', password: 'password'});
      const objForDelete = await request(server).delete(`/user/${response.body.id}`)
      
      const verifyUserQuantities = await request(server).get('/users');

      expect(objForDelete.status).toEqual(200);
      expect(verifyUserQuantities.status).toEqual(204);

    })
  })
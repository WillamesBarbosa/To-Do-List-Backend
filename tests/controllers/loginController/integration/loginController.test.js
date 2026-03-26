const request = require('supertest');
const app = require('../../../../src/index');
const database = require('../../../../src/database/config/config-knex');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable');
const createUserTokenToTest = require('../../../../src/app/utils/helpers/createUserTokenToTest/createUserTokenToTest');

beforeAll(async () => {
    await generateTable('users');

  });

  beforeEach(() => {
    return database('users').del();
  });
  
  afterAll(() => {
    return database.destroy();
  });

  const userToJWT = {
    name: 'name',
    email: 'email@email.com',
    password: '123456'
}

describe('loginController login tests', ()=>{
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
  
    const login = await request(server).post('/login').send({ email: 'email2@email.com', password: '123456' });

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


describe('LoginController refresh tests', ()=>{
  test('Should return status 200 and token access jwt and token refresh', async()=>{
    const server =  app;
    
    const user = await createUserTokenToTest(app, userToJWT)    
    const refresh = await request(server).post('/refresh').set('x_token_refresh', `Refresh ${user.refreshToken}`);

    expect(refresh.status).toEqual(200);
    expect(refresh.body.refreshToken).not.toEqual(user.refreshToken);
  })

  test('Should return 401 unauthorized if x_token_refresh are invalid', async()=>{
    const server = app;

    const refresh = await request(server)    
    .post('/refresh')
    .set('x_token_refresh', `Refresh eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjZjVkMTk0LTIwMjMtNGNhYS1iYzc5LTM3ZmJlMTgxN2E4MCIsImp0aSI6IjU5NzliMWIyLWI2OWQtNDFhOC1iMmY2LTA3M2NiMzQzMzI4MCIsImlhdCI6MTc3Mzc0MjY4OCwiZXhwIjoxNzczNzQzNTg4fQ.qfloVFG_N8ZjVXLiCAvlQ4yQrraUlzeBg86v14P-wJ0`)
    

    expect(refresh.status).toEqual(401);
  })

    test('Should return 401 unauthorized if x_token_refresh are null', async()=>{
    const server = app;

    const refresh = await request(server)    
    .post('/refresh')
    .set('x_token_refresh', '');
    

    expect(refresh.status).toEqual(401);
  })
})


describe('Test logout', ()=>{
  test('Should return 200 same token invalid', async()=>{
    const server = app;

    const logout = await request(server)    
    .post('/logout')
    .set('x_token_refresh', 'abc');
    
    expect(logout.status).toEqual(200);
  })

    test('It should return 200 on logout and 401 on refresh.', async()=>{
    const server =  app;
    
    const user = await createUserTokenToTest(app, userToJWT);

    const logout = await request(server)    
    .post('/logout')
    .set('x_token_refresh', `Refresh ${user.refreshToken}`);

    const refresh = await request(server)    
    .post('/refresh')
    .set('x_token_refresh', `Refresh ${user.refreshToken}`);
    
    expect(logout.status).toEqual(200);
    expect(refresh.status).toEqual(401);
  })
})
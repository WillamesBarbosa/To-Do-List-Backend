const request = require('supertest')
const app = require('../../../../src/index');
const generateTable = require('../../../../src/app/utils/helpers/generateTable/generateTable')
const responsesHTTP = require('../../../../src/app/utils/helpers/responsesHTTPS');
const database = require('../../../../src/database/config/config-knex');
const createUserTokenToTest = require('../../../../src/app/utils/helpers/createUserTokenToTest/createUserTokenToTest');

  let server = app
  const user = {
    name: 'name',
    email: 'email@gmail.com',
    password: '123456'
  }

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
  test('Should return Bad Request', async()=>{
    const response = await request(server).get('/user')

    expect(response.status).toEqual(responsesHTTP.BAD_REQUEST.status)
    expect(response.body).toEqual(responsesHTTP.BAD_REQUEST.message)
  })

  test('Should return Unauthorized', async()=>{
    const response = await request(server).get('/user').set('authorization', 'Bearer invalidToken')

    expect(response.status).toEqual(responsesHTTP.UNAUTHORIZED.status)
  })

  test('Should return id in request', async()=>{
    const token = await createUserTokenToTest(server, user)
    const response = await request(server).get('/user').set('authorization', token)

    expect(response.body.id).toEqual(token.id)
  })
})

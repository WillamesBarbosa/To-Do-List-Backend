const request = require('supertest')

async function createUserTokenToTest(app, user = {}){
    const userData = {
        name: user.name,
        email: user.email,
        password: user.password,
    }

    await request(app).post('/user').send(userData);
    const tokenToTest = await request(app).post('/login').send({email: userData.email, password: userData.password});
    return tokenToTest.body.token
}

module.exports = createUserTokenToTest;
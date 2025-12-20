const request = require('supertest')

async function createUserTokenToTest(app, user = {}){
    const userData = {
        name: user.name,
        email: user.email,
        password: user.password,
    }

    const userCreated = await request(app).post('/user').send(userData);
    const tokenToTest= await request(app).post('/login').send({email: userData.email, password: userData.password});

    return { id: userCreated.body.id, token: tokenToTest.body.token}
}

module.exports = createUserTokenToTest;
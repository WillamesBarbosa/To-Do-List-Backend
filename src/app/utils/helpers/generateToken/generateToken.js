const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');


function generateToken(userId, secret, expiration){

    const token = jwt.sign(
        {
            // Esse jti serve para que os tokens sejam gerados diferentes, mesmo sendo executados no mesmo tick ou ao mesmo tempo
            // Vai evitar que dê problema caso sejam feitos 2 refreshs ao mesmo tempo
            id: userId, jti: randomUUID()
        }, 
        secret,
        {
            expiresIn: expiration,
        } 
    )

    return token

}

module.exports = generateToken;
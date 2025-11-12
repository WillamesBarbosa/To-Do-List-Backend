const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function generateToken(user, password){
    const firstText = process.env.PASS_FIRSTTEXT;
    const secondText = process.env.PASS_SECONDTEXT;
    const toCompare = `${firstText}${password}${secondText}`;
    const [ userObj ] = user;

    const tokenSecret = process.env.TOKEN_SECRET; 
    const tokenExpiration = process.env.TOKEN_EXPIRATION;

    const passwordAuth = await bcrypt.compare(toCompare, userObj.password);

    if(!passwordAuth) return false;
    

    const token = await jwt.sign(
        {
            id: userObj.id
        }, 
        tokenSecret,
        {
            expiresIn: tokenExpiration,
        } 
    )

    return token

}

module.exports = generateToken;
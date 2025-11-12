const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authenticationService(token){
    try {
        const pureToken = token.replace(/^Bearer\s+/i, '');
        if(pureToken === undefined || pureToken === null) return { isValid: false, message: { error: 'Token not informed'}};
        const decode = jwt.verify(pureToken, process.env.TOKEN_SECRET);
        
        return { isValid: true, decode};
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return { isValid: false, message: { error: 'Token expired.'}}
        }
        
        console.log(error)
        return { isValid: false, message: { error: 'Token invalid.'}}

    }


}

module.exports = authenticationService;
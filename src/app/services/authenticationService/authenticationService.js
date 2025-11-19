const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authenticationService(token){
    try {
        if(token === undefined || token === null) return { isValid: false, message: { error: 'Token not informed'}};
        
        const pureToken = token.replace(/^Bearer\s+/i, '');
        const decoded = jwt.verify(pureToken, process.env.TOKEN_SECRET);
        
        return { isValid: true, decoded};
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return { isValid: false, message: { error: 'Token expired.'}}
        }
               
        return { isValid: false, message: { error: 'Token invalid.'}}

    }


}

module.exports = authenticationService;
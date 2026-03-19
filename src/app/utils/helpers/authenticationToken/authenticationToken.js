const jwt = require('jsonwebtoken');

function authenticationToken(token, secret, prefix){
    try {
        if(token === undefined || token === null) return { isValid: false, message: { error: 'Token not informed'}};
        
        const pureToken = token.replace(new RegExp(`^${prefix}\\s+`, 'i'), '');
        const decoded = jwt.verify(pureToken, secret);
        
        return { isValid: true, decoded};
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return { isValid: false, message: { error: 'Token expired.'}}
        }
               
        return { isValid: false, message: { error: 'Token invalid.'}}

    }


}

module.exports = authenticationToken;
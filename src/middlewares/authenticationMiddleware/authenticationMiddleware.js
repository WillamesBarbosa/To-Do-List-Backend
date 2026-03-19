    const authenticationToken = require("../../app/utils/helpers/authenticationToken/authenticationToken");
    const ErrorsHTTP = require("../../app/utils/helpers/ErrorsHTTP");
    const responsesHTTP = require("../../app/utils/helpers/responsesHTTPS");
    require('dotenv').config();

    function authenticationMiddleware(request, response, next){
        const token = request.headers.authorization;
        if(!token){
            return next( new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status))
        }
        const authInfos = authenticationToken(token, process.env.TOKEN_SECRET, 'Bearer');
        if(!authInfos.isValid){
            return next( new ErrorsHTTP(authInfos.message, responsesHTTP.UNAUTHORIZED.status) );
            
        } 

        request.id = authInfos.decoded.id;
        next();
    }

    module.exports = authenticationMiddleware;
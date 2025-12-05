    const authenticationService = require("../../app/services/authenticationService/authenticationService");
    const ErrorsHTTP = require("../../app/utils/helpers/ErrorsHTTP");
    const responsesHTTP = require("../../app/utils/helpers/responsesHTTPS");

    async function authenticationMiddleware(request, response, next){
        const token = request.headers.authorization;

        if(!token){
            return next( new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status))
        }
        const authInfos = await authenticationService(token);

        if(!authInfos.isValid){
            return next( new ErrorsHTTP(authInfos.message, responsesHTTP.UNAUTHORIZED.status) );
            
        } 

        request.id = authInfos.decoded.id;
        next();
    }

    module.exports = authenticationMiddleware;
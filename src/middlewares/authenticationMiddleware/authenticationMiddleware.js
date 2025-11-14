const authenticationService = require("../../app/services/authenticationService/authenticationService");
const ErrorsHTTP = require("../../app/utils/helpers/ErrorsHTTP");
const responsesHTTP = require("../../app/utils/helpers/responsesHTTPS");

async function authenticationMiddleware(request, response, next){
    const token = request.headers.authorization;
    const decode = await authenticationService(token);
    if(!decode.isValid) next( new ErrorsHTTP(decode.message, responsesHTTP.UNAUTHORIZED.status) );

    request.id = decode.id;
    next();
}

module.exports = authenticationMiddleware;
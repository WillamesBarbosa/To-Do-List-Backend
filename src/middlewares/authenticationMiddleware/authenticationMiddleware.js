const authenticationService = require("../../app/services/authenticationService/authenticationService");
const ErrorsHTTP = require("../../app/utils/helpers/ErrorsHTTP");
const responsesHTTP = require("../../app/utils/helpers/responsesHTTPS");

async function authenticationMiddleware(request, response, next){
    const token = request.headers.authorization;
    const decoded = await authenticationService(token);
    if(!decoded.isValid) next( new ErrorsHTTP(decoded.message, responsesHTTP.UNAUTHORIZED.status) );

    request.id = decoded.id;
    next();
}

module.exports = authenticationMiddleware;
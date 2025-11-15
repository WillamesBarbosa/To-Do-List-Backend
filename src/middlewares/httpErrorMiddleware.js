const responsesHTTP = require("../app/utils/helpers/responsesHTTPS");

function httpErrorHandler(error, request, response, next){
    if(error && error.statusCode){
        return response.status(error.statusCode).json(error.message);
    }
    return response.status(responsesHTTP.INTERNAL_SERVER_ERROR.status).json(responsesHTTP.INTERNAL_SERVER_ERROR);
}

module.exports = httpErrorHandler;
class ErrorsHTTP extends Error{
    constructor(message, statusCode, extra = {}){
        super();
        this.message = message,
        this.statusCode = statusCode;
        if(extra) Object.assign(this, extra)
    }
}

module.exports = ErrorsHTTP;
function resolver (handlerFn){
    return (request, response, next) =>{
        return Promise.resolve(handlerFn(request, response, next))
        .catch(e=> next(e));
    }
}

module.exports = resolver;
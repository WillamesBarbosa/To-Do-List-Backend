const userRepository = require("../../repositories/UserRepository/userRepository");
const hashPassword = require("../../services/HashPassword/hashPassword");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const generateUUID = require("../../utils/helpers/generateUUID");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const verifyParams = require("../../utils/validators/verifyParams/verifyParams");
const isValidEmail = require('../../utils/validators/isValidEmail/isValidEmail');

class UserController{

    async index(request, response){
        const users = await userRepository.findAll();
        if(users.length === 0) throw new ErrorsHTTP(responsesHTTP.NO_CONTENT, responsesHTTP.NO_CONTENT.status);

        return response.status(responsesHTTP.SUCCESS.status).json(users);
    }

    async store(request, response){
        const {name, email, password} = request.body;
        
        const parameterValidation = verifyParams(name, email, password);
        if(!parameterValidation.valid){
            throw new ErrorsHTTP(parameterValidation.message, responsesHTTP.BAD_REQUEST.status);
        }

        const emailIsValid = isValidEmail(email);
        if(!emailIsValid.isValid) throw new ErrorsHTTP(emailIsValid.message, responsesHTTP.BAD_REQUEST.status);


        const emailAlreadyExist =  await userRepository.findByEmail(email);
        if(emailAlreadyExist) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST, responsesHTTP.BAD_REQUEST.status)
        
            const id = generateUUID();
        
        const hashedPassword = await hashPassword(password)
        const user = await userRepository.create(id, name, email, hashedPassword);

        return response.status(responsesHTTP.CREATED.status).json(user);
    }
}

module.exports = new UserController();
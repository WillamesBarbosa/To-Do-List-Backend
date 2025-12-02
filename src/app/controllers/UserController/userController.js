const userRepository = require("../../repositories/UserRepository/userRepository");
const hashPassword = require("../../services/hashPassword/hashPassword");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const generateUUID = require("../../utils/helpers/generateUUID");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const verifyParams = require("../../utils/validators/verifyParams/verifyParams");
const isValidEmail = require('../../utils/validators/isValidEmail/isValidEmail');
const updateAt = require("../../utils/helpers/updateAt/updateAt");

class UserController{

    async index(request, response){
        const users = await userRepository.findAll();
        if(users.length === 0) throw new ErrorsHTTP(responsesHTTP.NO_CONTENT.message, responsesHTTP.NO_CONTENT.status);

        return response.status(responsesHTTP.SUCCESS.status).json(users);
    }

    async show(request, response){
    const id = request.id

    const user = await userRepository.findById(id);
    return response.status(responsesHTTP.SUCCESS.status).json(user);

    }

    async store(request, response){
        const {name, email, password} = request.body;
        const parameterValidation = verifyParams({ name, email, password });
        if(!parameterValidation.valid){
            throw new ErrorsHTTP(parameterValidation.message, responsesHTTP.BAD_REQUEST.status);
        }
        const emailIsValid = isValidEmail(email);
        if(!emailIsValid.isValid) throw new ErrorsHTTP(emailIsValid.message, responsesHTTP.BAD_REQUEST.status); 

        const emailAlreadyExist =  await userRepository.findByEmail(email);
        if(emailAlreadyExist) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status)
        
        const id = generateUUID();
        
        const hashedPassword = await hashPassword(password)
        const user = await userRepository.create(id, name, email, hashedPassword);

        return response.status(responsesHTTP.CREATED.status).json(user);
    }

    async update(request, response){
        const id = request.id;
        const { name, email } = request.body;
        
        const parameterValidation = verifyParams({ name, email });
        if(!parameterValidation.valid) throw new ErrorsHTTP(parameterValidation.message, responsesHTTP.BAD_REQUEST.status);
        
        const emailIsValid = isValidEmail(email);
        if(!emailIsValid.isValid) throw new ErrorsHTTP(emailIsValid.message, responsesHTTP.BAD_REQUEST.status);
        
        const emailAlreadyExist =  await userRepository.findByEmail(email);
        
        if(emailAlreadyExist && emailAlreadyExist.id !== id) throw new ErrorsHTTP(responsesHTTP.BAD_REQUEST.message, responsesHTTP.BAD_REQUEST.status);
        
        const updatedAt = updateAt();
        const user = await userRepository.update(id, name, email, updatedAt);

        return response.status(responsesHTTP.SUCCESS.status).json(user);

    }

    async delete(request, response){
        const id = request.id;

        await userRepository.delete(id)

        return response.status(responsesHTTP.SUCCESS.status).json(responsesHTTP.SUCCESS);

    }
}

module.exports = new UserController();
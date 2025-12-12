const userRepository = require("../../repositories/UserRepository/userRepository");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const generateUUID = require("../../utils/helpers/generateUUID");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const isValidEmail = require("../../utils/validators/isValidEmail/isValidEmail");
const verifyParams = require("../../utils/validators/verifyParams/verifyParams");
const hashPassword = require('../hashPassword/hashPassword')
const updateAt = require('../../utils/helpers/updateAt/updateAt')

async function findAll(){
        const users = await userRepository.findAll();
        if(users.length === 0) throw new ErrorsHTTP(responsesHTTP.NO_CONTENT.message, responsesHTTP.NO_CONTENT.status);

        return users
}

async function getUser(request){
        const id = request.id
        // Não precisa de validacao, pois o Middleware de autenticacao já valida que o id existe
        const user = await userRepository.findById(id);

        return user
}

async function create(request){
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
        
        const hashedPasswordConst = await hashPassword(password)
        const user = await userRepository.create(id, name, email, hashedPasswordConst);

        return user
}

async function update(request){
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

        return user;
}

async function deleteUser(request){
        const id = request.id;
        // Também não precisa de validacao, o middleware de autenticacao ja garente que o id existe
        await userRepository.delete(id)
}

module.exports = { findAll, getUser, create, update, deleteUser }


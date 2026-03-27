const { findByEmail } = require("../../repositories/UserRepository/userRepository");
const generateToken = require("../../utils/helpers/generateToken/generateToken");
const verifyParams = require('../../utils/validators/verifyParams/verifyParams');
const isValidEmail = require("../../utils/validators/isValidEmail/isValidEmail");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const logger = require("../../utils/helpers/logger/logger");
const RefreshTokenRepository = require("../../repositories/RefreshTokenRepository/RefreshTokenRepository");
const validatePassword = require("../../utils/helpers/validatePassword/validatePassword");

require('dotenv').config();


async function loginService(request){
        const { email, password } = request.body;
        const emailOrPasswordIsUndefined = verifyParams({ email, password });
        if(!emailOrPasswordIsUndefined.valid) throw new ErrorsHTTP(emailOrPasswordIsUndefined.message, responsesHTTP.BAD_REQUEST.status);

        const emailIsValid = isValidEmail(email);
        if(!emailIsValid.isValid) throw new ErrorsHTTP(emailIsValid.message, responsesHTTP.BAD_REQUEST.status);
        
        const user = await findByEmail(email);
        
        if(!user){
                logger.warn({ email }, 'Attempt to log in with an unregistered email address.');
                
                throw new ErrorsHTTP({error: 'Email not found.'}, responsesHTTP.BAD_REQUEST.status);
        } 
                
        
        const isValidPassword = await validatePassword(user, password);
        if(!isValidPassword){
                logger.warn({ email }, 'Incorrect password login attempt');
                
                throw new ErrorsHTTP({error: 'Password incorrect.'}, responsesHTTP.BAD_REQUEST.status);
        }
        //AQUI É GERADO O JWT DE ACESSO
        const token = generateToken(user.id, process.env.TOKEN_SECRET, process.env.TOKEN_EXPIRATION);

        // Caso exista algum tokenRefresh, ele será deletado. Caso não exista, essa função é ignorada e o fluxo continua
        await RefreshTokenRepository.revokeToken(user.id);
        
        //AQUI É VALIDADO E GERADO O REFRESH TOKEN
        const refreshToken = generateToken(user.id, process.env.TOKEN_REFRESH_SECRET, process.env.TOKEN_REFRESH_EXPIRATION);

        await RefreshTokenRepository.save(user.id, refreshToken);
        
        logger.info({ email, userId: user.id }, 'Successful login');

        return {isValid: true, token, refreshToken};

}

module.exports = loginService;
const { findByEmail } = require("../../repositories/UserRepository/userRepository");
const generateToken = require("../generateToken/generateToken");
const verifyParams = require('../../utils/validators/verifyParams/verifyParams');
const isValidEmail = require("../../utils/validators/isValidEmail/isValidEmail");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");

async function loginService(request){
        const { email, password } = request.body;
        const emailOrPasswordIsUndefined = verifyParams({ email, password });
        if(!emailOrPasswordIsUndefined.valid) throw new ErrorsHTTP(emailOrPasswordIsUndefined.message, responsesHTTP.BAD_REQUEST.status);

        const emailIsValid = isValidEmail(email);
        if(!emailIsValid.isValid) throw new ErrorsHTTP(emailIsValid.message, responsesHTTP.BAD_REQUEST.status);
        
        const user = await findByEmail(email);
        if(!user) throw new ErrorsHTTP({error: 'Email not found.'}, responsesHTTP.BAD_REQUEST.status);
        
        const token = await generateToken(user, password);
        if(!token) throw new ErrorsHTTP({error: 'Password incorrect.'}, responsesHTTP.BAD_REQUEST.status);
        
        return {isValid: true, token};

}

module.exports = loginService;
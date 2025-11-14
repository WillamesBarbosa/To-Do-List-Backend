const loginService = require("../../services/loginService/loginService");
const ErrorsHTTP = require("../../utils/helpers/ErrorsHTTP");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");
const isValidEmail = require("../../utils/validators/isValidEmail/isValidEmail");
const verifyParams = require("../../utils/validators/verifyParams/verifyParams");

class LoginController {
    async login(request, response){
        const { email, password } = request.body;
        const emailOrPasswordIsUndefined = verifyParams({ email, password });
        if(!emailOrPasswordIsUndefined.valid) throw new ErrorsHTTP(emailOrPasswordIsUndefined.message, responsesHTTP.BAD_REQUEST.status);
        
        const emailIsValid = isValidEmail(email);
        if(!emailIsValid.isValid) throw new ErrorsHTTP(emailIsValid.message, responsesHTTP.BAD_REQUEST.status);
        
        const token = await loginService(email, password);
        if(!token.isValid) throw new ErrorsHTTP(token.message, responsesHTTP.BAD_REQUEST.status);

        return response.status(200).json({ token: token.token });
    }
}

module.exports = new LoginController();
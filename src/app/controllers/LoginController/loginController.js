const loginService = require("../../services/loginService/loginService");

class LoginController {
    async login(request, response){     
        const token = await loginService(request);

        return response.status(200).json({ token: token.token });
    }
}

module.exports = new LoginController();
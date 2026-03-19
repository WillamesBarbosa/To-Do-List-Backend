const loginService = require("../../services/loginService/loginService");
const refreshTokenService = require("../../services/refreshTokenService.js/refreshTokenService");

class LoginController {
    async login(request, response){     
        const token = await loginService(request);

        return response.status(200).json({ token: token.token, refreshToken: token.refreshToken });
    }

    async refresh(request, response){
        const tokenRefresh = await refreshTokenService(request);

        return response.status(200).json({ token: tokenRefresh.token, refreshToken: tokenRefresh.refreshToken })
    }
}

module.exports = new LoginController();
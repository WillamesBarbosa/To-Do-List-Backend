const loginService = require("../../services/loginService/loginService");
const logoutService = require("../../services/logoutService/logoutService");
const refreshTokenService = require("../../services/refreshTokenService.js/refreshTokenService");
const responsesHTTP = require("../../utils/helpers/responsesHTTPS");

class LoginController {
    async login(request, response){     
        const token = await loginService(request);

        return response.status(responsesHTTP.SUCCESS.status).json({ token: token.token, refreshToken: token.refreshToken });
    }

    async refresh(request, response){
        const tokenRefresh = await refreshTokenService(request);

        return response.status(responsesHTTP.SUCCESS.status).json({ token: tokenRefresh.token, refreshToken: tokenRefresh.refreshToken })
    }

    async logout(request, response){
        await logoutService(request);

        return response.status(responsesHTTP.SUCCESS.status).json(responsesHTTP.SUCCESS);
    }
}

module.exports = new LoginController();
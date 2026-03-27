const RefreshTokenRepository = require("../../repositories/RefreshTokenRepository/RefreshTokenRepository");
const authenticationToken = require("../../utils/helpers/authenticationToken/authenticationToken");
const logger = require('../../utils/helpers/logger/logger')
require('dotenv').config();


async function logoutService(request){
    const tokenRefresh = request.headers.x_token_refresh;
    const tokenIsValid = authenticationToken(tokenRefresh, process.env.TOKEN_REFRESH_SECRET, 'Refresh');

    if(!tokenIsValid.isValid) return;

    await RefreshTokenRepository.revokeToken(tokenIsValid.decoded.id);
    logger.info({userId: tokenIsValid.decoded.id}, 'Logout successful');
    return
}

module.exports = logoutService
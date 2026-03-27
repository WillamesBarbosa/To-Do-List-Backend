const RefreshTokenRepository = require('../../repositories/RefreshTokenRepository/RefreshTokenRepository');
const ErrorsHTTP = require('../../utils/helpers/ErrorsHTTP');
const generateToken = require('../../utils/helpers/generateToken/generateToken');
const responsesHTTP = require('../../utils/helpers/responsesHTTPS');
const logger = require("../../utils/helpers/logger/logger");
const authenticationToken = require('../../utils/helpers/authenticationToken/authenticationToken');
require('dotenv').config();

async function refreshTokenService(request){
    const tokenRefresh = request.headers.x_token_refresh;
    
    const tokenIsValid = authenticationToken(tokenRefresh, process.env.TOKEN_REFRESH_SECRET, 'Refresh');
    if(!tokenIsValid.isValid) throw new ErrorsHTTP(responsesHTTP.UNAUTHORIZED.message, responsesHTTP.UNAUTHORIZED.status);
    
    const user = await RefreshTokenRepository.findByUserId(tokenIsValid.decoded.id);
    if(!user){
        logger.warn({ userId: tokenIsValid.decoded.id },
            'Refresh token not found in Redis. Possible use after logout or stolen token.'
        )

        throw new ErrorsHTTP(responsesHTTP.UNAUTHORIZED.message, responsesHTTP.UNAUTHORIZED.status);
    } 
        

    await RefreshTokenRepository.revokeToken(tokenIsValid.decoded.id);
    
    const tokenUpdated = generateToken(tokenIsValid.decoded.id, process.env.TOKEN_REFRESH_SECRET, process.env.TOKEN_REFRESH_EXPIRATION);
    await RefreshTokenRepository.save(tokenIsValid.decoded.id, tokenUpdated)
    
    const tokenAcess = generateToken(tokenIsValid.decoded.id, process.env.TOKEN_SECRET, process.env.TOKEN_EXPIRATION);

    logger.info({userId: tokenIsValid.decoded.id },'Token rotation successfully completed.');

    return { token: tokenAcess, refreshToken: tokenUpdated };
}

module.exports = refreshTokenService;
const redis = require('../../../database/config/config-redis');
require('dotenv').config();

const RefreshTokenRepository = {
    async save(userId, refreshToken) {
        await redis.set(userId, refreshToken, 'EX', 60 * 60 * 24 * 7);
    },

    async findByUserId(userId) {
        return await redis.get(userId);
    },

    async deleteUser(userId) {
        await redis.del(userId);
    }
};

module.exports = RefreshTokenRepository;
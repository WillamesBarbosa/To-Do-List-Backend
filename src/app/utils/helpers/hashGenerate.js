const crypto = require('crypto');
const HashCode = require('../../../../code.hash');

function hashGenerate(data) {
    const uniqueString = `${HashCode}-${data}-${Date.now()}-${Math.random()}`;
    const newHash = crypto.createHash('sha256').update(uniqueString).digest('hex');

    return newHash
}

module.exports = hashGenerate;
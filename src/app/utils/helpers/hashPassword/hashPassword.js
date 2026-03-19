require('dotenv').config();
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const salts = parseInt(process.env.PASS_SALTS);
    const firstText = process.env.PASS_FIRSTTEXT;
    const secondText = process.env.PASS_SECONDTEXT;
    const toHash = `${firstText}${password}${secondText}`;

    const hashedPassword = await bcrypt.hash(toHash, salts);
    
    return hashedPassword;

}

module.exports = hashPassword;

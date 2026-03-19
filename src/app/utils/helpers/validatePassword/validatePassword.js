const bcrypt = require('bcrypt');
require('dotenv').config();


async function validatePassword(user, password){
        const firstText = process.env.PASS_FIRSTTEXT;
        const secondText = process.env.PASS_SECONDTEXT;
        const toCompare = `${firstText}${password}${secondText}`;
        const passwordAuth = await bcrypt.compare(toCompare, user.password);
    
        if(!passwordAuth) return false;

        return true;
}

module.exports = validatePassword;
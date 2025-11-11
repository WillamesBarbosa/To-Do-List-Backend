const { findByEmail } = require("../../repositories/UserRepository/userRepository");
const generateToken = require("../generateToken/generateToken");

async function loginService(email, password){
        const user = await findByEmail(email);
        if(!user) return { isValid: false, message: { error: 'Email not found.'} }
        
        const token = await generateToken(user, password);
        if(!token) return { isValid: false, message: { error: 'Password incorrect.'} }
        
        return {isValid: true, token};

}

module.exports = loginService;
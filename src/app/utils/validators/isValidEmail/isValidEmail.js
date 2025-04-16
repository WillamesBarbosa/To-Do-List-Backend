const validator = require('validator');
function isValidEmail(email) {
    const isValid = validator.isEmail(email);
    return isValid ? { isValid: true} : { isValid: false, message: { error: 'Email is invalid.' }};
}

module.exports = isValidEmail;
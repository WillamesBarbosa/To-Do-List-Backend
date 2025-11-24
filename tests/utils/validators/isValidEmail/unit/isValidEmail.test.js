const isValidEmail = require("../../../../../src/app/utils/validators/isValidEmail/isValidEmail")

describe('Test isValidEmail', ()=>{
    test('Should return email is invalid', ()=>{
        const response = isValidEmail('email#email.com');

        expect(response.isValid).toEqual(false);
        expect(response.message).toEqual({ error: 'Email is invalid.' })
    })

    test('Should return email is invalid', ()=>{
        const response = isValidEmail('email@email.com');

        expect(response.isValid).toEqual(true);
    })
})
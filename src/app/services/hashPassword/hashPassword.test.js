const hashPassword = require('../hashPassword/hashPassword');

describe('Should test hashPassword', ()=>{
    test('Should return hashed password', async ()=>{
        const password = 123456;
        const hashedPassword = await hashPassword(password);


        expect(typeof hashedPassword).toBe('string');
        expect(hashedPassword).not.toEqual(password);
    })

});
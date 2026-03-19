const jwt = require('jsonwebtoken');

const generateToken = require('../../../../../src/app/utils/helpers/generateToken/generateToken');

describe('Test generateToken', ()=>{
    test('Should return a token', ()=>{
        const token = generateToken('fake-id', 'secret', '1h');
        const decoded = jwt.verify(token, 'secret');

        expect(decoded.id).toBe('fake-id');
    })

    test('Should return a token', ()=>{

        const result = generateToken('fake-id', 'secret', '1h');

        expect(typeof result).toBe('string');
    })
})
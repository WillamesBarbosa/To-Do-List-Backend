const isValidDate = require("../../../../../src/app/utils/validators/isValidDate/isValidDate")

describe('Test isValidDate', ()=>{
    test('Should return false if parameter is empty', ()=>{
        const response = isValidDate('');

        expect(response.isValid).toEqual(false);
    })

    test('Should return false if date format is incorrect', ()=>{
        const response1 = isValidDate('01-01-2001');
        const response2 = isValidDate('12-09-2006');

        expect(response1.isValid).toEqual(false);
        expect(response2.isValid).toEqual(false);
    })

    test('Should return false if date does not exist', ()=>{
        const response = isValidDate('2008-02-30');

        expect(response.isValid).toEqual(false);
    })

    test('Should return true if date is correct', ()=>{
        const response = isValidDate('2026-01-15');

        expect(response.isValid).toEqual(true);
        expect(response.date).toEqual('2026-01-15');
    })
})

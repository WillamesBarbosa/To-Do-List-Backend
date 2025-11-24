const isValidUUID = require("../../../../../src/app/utils/validators/isValidUUid/isValidUUID")

describe('Test isValidUUID', ()=>{
  test('Should return false', ()=>{
    const response = isValidUUID('xxxxxxxx-xxxx-1xxx-xxxx-xxxxxxxxxxxx');
    
    expect(response).toEqual(false)

    })

    test('Should return true', ()=>{
    const response = isValidUUID('550e8400-e29b-41d4-a716-446655440000');
    
    expect(response).toEqual(true)

    })
})
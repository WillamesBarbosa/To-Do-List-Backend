const hashGenerate = require('../../../../../src/app/utils/helpers/hashGenerate');

test('Should return different hash', ()=>{
    const hash1 = hashGenerate('data');
    const hash2 = hashGenerate('data');

    expect(hash1 === hash2).toEqual(false)
})

test('Should have length to equal 64', ()=>{
    const hash = hashGenerate('data');

    expect(hash).toHaveLength(64);
})
const verifyParams = require('../verifyParams/verifyParams');

test('Should return true if title and description exist', ()=>{
    const title = 'Titulo';
    const description = 'Descrição';

    const validation = verifyParams(title, description);

    expect(validation.valid).toEqual(true);
})

test('Should return false if title is empty and message error', ()=>{
    const title = '';
    const description = 'Descrição'

    const validation = verifyParams(title, description);

    expect(validation.message).toEqual({ error: 'Title is required.' })
    expect(validation.valid).toEqual(false);

})

test('Should return false if description is empty and message error', ()=>{
    const title = 'Titulo';
    const description = ''

    const validation = verifyParams(title, description);

    expect(validation.message).toEqual({ error: 'Description is required.' })
    expect(validation.valid).toEqual(false);

})


test('should return false if both are empty and message error', ()=>{
    const title = '';
    const description = ''

    const validation = verifyParams(title, description);

    expect(validation.message).toEqual({ error: 'Title is required.' })
    expect(validation.valid).toEqual(false);
})
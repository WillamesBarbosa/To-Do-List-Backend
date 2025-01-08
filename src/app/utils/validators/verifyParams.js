function verifyParams(title, description) {
    if(!title) return {valid: false, error: 'Title is required.'}
    if(!description) return {valid: false, error: 'Description is required.'}


    return {valid: true};
}

module.exports = verifyParams;
function verifyParams(title, description) {
    if(!title) return {valid: false, message: { error: 'Title is required.' }}
    if(!description) return {valid: false, message: { error: 'Description is required.' }}


    return {valid: true};
}

module.exports = verifyParams;
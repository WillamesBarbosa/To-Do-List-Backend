function isValidHash(id) {
    const hashRegex = /^[a-fA-F0-9]{64}$/;
    return hashRegex.test(id);
}


module.exports = isValidHash;
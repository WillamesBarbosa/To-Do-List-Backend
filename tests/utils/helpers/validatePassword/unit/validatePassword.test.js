const bcrypt = require('bcrypt');
const validatePassword = require('../../../../../src/app/utils/helpers/validatePassword/validatePassword');

const PASS_FIRSTTEXT = process.env.PASS_FIRSTTEXT || 'first';
const PASS_SECONDTEXT = process.env.PASS_SECONDTEXT || 'second';

describe('Test validatePassword', () => {
    test('Should return true if password is correct', async () => {
        const password = '123456';
        const toHash = `${PASS_FIRSTTEXT}${password}${PASS_SECONDTEXT}`;
        const hash = await bcrypt.hash(toHash, 10);

        const result = await validatePassword({ password: hash }, password);
        expect(result).toBe(true);
    });

    test('Should return false if password is incorrect', async () => {
        const password = '123456';
        const toHash = `${PASS_FIRSTTEXT}${password}${PASS_SECONDTEXT}`;
        const hash = await bcrypt.hash(toHash, 10);

        const result = await validatePassword({ password: hash }, 'wrong-password');
        expect(result).toBe(false);
    });
});
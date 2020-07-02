import PBKDF2 from "../../src/algorithms/PBKDF2";
import { v4 as uuidv4 } from 'uuid';

let pbkd = new PBKDF2();
test('Hash password with PBKDF2 works', () => {
    let testPassword = uuidv4();
    let hashedPassword = pbkd.hashPBKDF2(testPassword);
    expect(hashedPassword).not.toBe(testPassword);
})

test('verifying a password with pbkdf2 works', () => {
    let testPassword = uuidv4();
    let wrongPassword = uuidv4();
    let hashedPassword = pbkd.hashPBKDF2(testPassword);

    expect(pbkd.verify(testPassword, hashedPassword)).toBe(true);
    expect(pbkd.verify(wrongPassword, hashedPassword)).toBe(false);
})
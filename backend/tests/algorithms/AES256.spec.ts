require('dotenv-flow').config();
import AES256 from "../../src/algorithms/AES256";
import { v4 as uuidv4 } from 'uuid';

let aes256Converter = new AES256();

test('aes256 encrypts and decrypts a given string as expected', () => {
    let testKey = uuidv4();
    let testString = uuidv4();

    let encryptedTestString = aes256Converter.encryptAES256(testKey, testString);
    expect(encryptedTestString).not.toBe(testString);

    let decryptedTestString = aes256Converter.decryptAES256(testKey, encryptedTestString);
    expect(decryptedTestString).not.toBe(encryptedTestString);
    expect(decryptedTestString).toBe(testString);
})

test('aes256, wrong key test case', () => {
    let testKey = uuidv4();
    let wrongKey = uuidv4();
    let testString = uuidv4();

    let encryptedTestString = aes256Converter.encryptAES256(testKey, testString);
    expect(encryptedTestString).not.toBe(testString)

    let wrongfullydecrypted = aes256Converter.decryptAES256(wrongKey, encryptedTestString);
    expect(wrongfullydecrypted).not.toBe(testString);
})
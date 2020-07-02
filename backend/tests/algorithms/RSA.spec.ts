import RSA from "../../src/algorithms/RSA";

test('RSA works', () => {
    let rsa = new RSA(512);
    let testString = 'GutenAbend';
    let encryptedString = rsa.encryptRSA(testString);
    let decryptedString = rsa.decryptRSA(encryptedString);
    expect(decryptedString).toBe(testString);
})
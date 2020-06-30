import Base64 from "../src/Base64";

test('Base64 can encode and decode a string', () => {
    const Base64Converter = new Base64();
    let testString = 'https://dev.to/muhajirdev/unit-testing-with-typescript-and-jest-2gln';
    let encodedTestString = Base64Converter.encodeBase64(testString);
    let decodedTestString = Base64Converter.decodeBase64(encodedTestString);
    expect(decodedTestString).toBe(testString);
})
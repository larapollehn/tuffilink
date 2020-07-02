import Base64 from "../../src/algorithms/Base64";
import { v4 as uuidv4 } from 'uuid';

const Base64Converter: Base64 = new Base64();

test('Base64 can encode and again decode a string', () => {
    let testString = uuidv4() + " " + uuidv4();
    let encodedTestString = Base64Converter.encodeBase64(testString);
    let decodedTestString = Base64Converter.decodeBase64(encodedTestString);
    expect(decodedTestString).toBe(testString);
})
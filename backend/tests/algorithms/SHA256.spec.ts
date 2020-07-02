import SHA256 from "../../src/algorithms/SHA256";
import { v4 as uuidv4 } from 'uuid';

test('sha356 hashes the given string', () => {
    let SHA256Converter = new SHA256();
    let testString = uuidv4();
    let hashedTestString = SHA256Converter.hashSHA256(testString);
    expect(hashedTestString).not.toBe(testString);
})
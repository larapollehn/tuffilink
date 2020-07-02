require('dotenv-flow').config();
import MD5 from "../../src/algorithms/MD5";
import { v4 as uuidv4 } from 'uuid';

test('MD5 hashed a given string as expected', () => {
    let MD5Converter = new MD5();
    let testString = uuidv4();
    let hashedTestString = MD5Converter.hashMD5(testString);
    expect(hashedTestString).not.toBe(testString);
})
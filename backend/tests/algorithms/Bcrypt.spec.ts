require('dotenv-flow').config();
import Bcrypt from "../../src/algorithms/Bcrypt";
import { v4 as uuidv4 } from 'uuid';

let bcryptHasher = new Bcrypt(10);
test('Bcrypt hashed a given password', () => {
    let testPassword = uuidv4();
    let hashedPassword = bcryptHasher.hashBcrypt(testPassword);
    expect(hashedPassword).not.toBe(testPassword);
})

test('Verifying a given password and its supposed hash value with bcrypt works', () =>{
    let testPassword = uuidv4();
    let hashedTestPassword = bcryptHasher.hashBcrypt(testPassword);

    let wrongPassword = uuidv4();

    expect(bcryptHasher.verifyBcryptPassword(testPassword, hashedTestPassword)).toBe(true);
    expect(bcryptHasher.verifyBcryptPassword(wrongPassword, hashedTestPassword)).toBe(false);

})
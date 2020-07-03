const pbkdf2 = require('pbkdf2');
import { v4 as uuidv4 } from 'uuid';

export class PBKDF2{
    private readonly iterations;
    private readonly keyLength;
    private readonly algorithm;

    constructor(iterations: number = 1, keyLength: number = 32, algorithm: string = 'sha512') {
        this.iterations = iterations;
        this.keyLength = keyLength;
        this.algorithm = algorithm;
    }

    hashPBKDF2(password:string, salt: string = null, iterations: number = null, keyLength: number = null, algorithm: string = null): string{
        if(salt === null){
            salt = uuidv4();
        }
        if(iterations === null){
            iterations = this.iterations;
        }
        if(keyLength === null){
            keyLength = this.keyLength;
        }
        if(algorithm === null){
            algorithm = this.algorithm;
        }
        return  `${salt}:${this.iterations}:${this.keyLength}:${this.algorithm}:${pbkdf2.pbkdf2Sync(password, salt, iterations, keyLength, algorithm).toString('hex')}`;
    }

    verify(userInputPassword: string, storedHash: string): boolean {
        let parts = storedHash.split(':');
        let salt = parts[0];
        let iterations = Number(parts[1]);
        let keyLength = Number(parts[2]);
        let algorithm = parts[3];
        let hashedInput = this.hashPBKDF2(userInputPassword, salt, iterations, keyLength, algorithm);
        return storedHash === hashedInput;
    }
}
const HASHING_ITERATIONS = 1000;

export const pbkdf = new PBKDF2(HASHING_ITERATIONS);


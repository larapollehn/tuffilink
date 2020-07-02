const bcrypt = require('bcrypt');

export default class Bcrypt {
    private readonly saltRounds;

    constructor(saltRounds: number) {
        this.saltRounds = saltRounds;
    }

    /**
     * hash a given password and use the specified rounds of salt
     * @param password in plain text
     * @param salt generated salt
     */
    hashBcrypt(password: string, salt: string = null): string{
        if (salt === null){
            salt = bcrypt.genSaltSync(this.saltRounds);
        }
        return `${salt}:${bcrypt.hashSync(password, salt)}`;
    }

    /**
     * verifies if a given plain text password and its assigned hash match
     * @param userInputPassword in plain text
     * @param storedHash that was saved for the given password
     */
    verifyBcryptPassword(userInputPassword: string, storedHash: string): Boolean{
        let parts = storedHash.split(":");
        let salt = parts[0];
        let hashedUserInput = this.hashBcrypt(userInputPassword, salt);
        return storedHash === hashedUserInput;
    }
}



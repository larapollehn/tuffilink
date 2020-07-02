const NodeRSA = require('node-rsa');

export default class RSA {
    private publicKey;
    private privateKey;
    private bitLength;
    private key;

    constructor(bitLength) {
        this.bitLength = bitLength;
        this.key = new NodeRSA({b: bitLength});
        this.privateKey = this.key.keyPair.d;
        this.publicKey = this.key.keyPair.e;
    }

    encryptRSA(data: string){
        return this.key.encrypt(data, 'base64');
    }

    decryptRSA(data: string){
        return this.key.decrypt(data, 'utf-8');
    }
}

let rsa = new RSA(512);


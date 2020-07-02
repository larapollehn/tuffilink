import { AES, enc } from 'crypto-ts';

export default class AES256{
    encryptAES256(key: string, data: string){
        return AES.encrypt(data, key).toString();
    }

    decryptAES256(key:string, data:string){
        return AES.decrypt(data, key).toString(enc.Utf8);
    }
}
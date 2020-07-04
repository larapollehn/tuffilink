import base64 from "../algorithms/Base64";

class LocalStorage{
    private key = 'USER_TOKEN';

    saveUserToken(token: {token: string}){
        localStorage.setItem(this.key, token.token);
    }

    getUserToken(){
        return localStorage.getItem(this.key);
    }

    getUserInfoFromToken(){
        const token = localStorage.getItem(this.key)!;
        const tokenParts = token.split('.');
        return JSON.parse(base64.decodeBase64(tokenParts[1]));
    }
}

const localStorageManager = new LocalStorage();

export default localStorageManager;
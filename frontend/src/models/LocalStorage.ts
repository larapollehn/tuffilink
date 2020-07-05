import base64 from "../algorithms/Base64";
import log from "../utils/Logger";

class LocalStorage{
    private readonly key = 'USER_TOKEN';

    saveUserToken(token: {token: string}){
        log.debug("Following bearer token will be saved", token);
        localStorage.setItem(this.key, token.token);
    }

    getUserToken(){
        if(this.getUserInfoFromToken()) {
            return localStorage.getItem(this.key);
        }else{
            localStorage.removeItem(this.key);
            return null;
        }
    }

    getUserInfoFromToken(){
        const token = localStorage.getItem(this.key)!;
        if(token){
            const tokenParts = token.split('.');
            const payloadObject =  JSON.parse(base64.decodeBase64(tokenParts[1]));
            log.debug("Following JWT payload object was retrieved from localStorage:", payloadObject);
            if(payloadObject["exp"] && payloadObject["exp"] < Date.now()){
                log.debug("JWT Payload can not be used anymore and was expired at ", payloadObject["exp"]);
                localStorage.removeItem(this.key);
                return null;
            }else {
                log.debug("JWT payload is still valid and can be used");
                return payloadObject;
            }
        } else {
            return null;
        }

    }
}

const localStorageManager = new LocalStorage();
export default localStorageManager;
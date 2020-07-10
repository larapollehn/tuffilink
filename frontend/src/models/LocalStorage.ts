import base64 from "../algorithms/Base64";
import log from "../utils/Logger";

class LocalStorage{
    private readonly key = 'USER_TOKEN';

    /**
     *save user JWT in localStorage
     * @param token is JWT Token
     */
    saveUserToken(token: {token: string}){
        log.debug("Following bearer token will be saved", token);
        localStorage.setItem(this.key, token.token);
    }

    /**
     * if user info could be retrieved token is returned
     * if token is malformed or expired delete it from localStorage to deauthorize user
     */
    getUserToken(){
        if(this.getUserInfoFromToken()) {
            return localStorage.getItem(this.key);
        }else{
            localStorage.removeItem(this.key);
            return null;
        }
    }

    /**
     * Check if user token expired
     * if token is still valid return payload of JWT token
     */
    getUserInfoFromToken(){
        const token = localStorage.getItem(this.key)!;
        if(token){
            const tokenParts = token.split('.');
            const payloadObject =  JSON.parse(base64.decodeBase64(tokenParts[1]));
            log.debug("Following JWT payload object was retrieved from localStorage:", payloadObject);
            if(payloadObject["exp"] && payloadObject["exp"] < Date.now()){
                log.debug("JWT Payload can not be used anymore, it expired at ", payloadObject["exp"]);
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

    deleteToken(){
        localStorage.removeItem(this.key);
    }
}

const localStorageManager = new LocalStorage();
export default localStorageManager;

class LocalStorage{
    private key = 'USER_TOKEN';

    saveUserToken(token: {token: string}){
        localStorage.setItem(this.key, token.token);
    }

    getUserToken(){
        return localStorage.getItem(this.key);
    }
}

const localStorageManager = new LocalStorage();

export default localStorageManager;
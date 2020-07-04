class LocalStorage{
    private key = 'USER_TOKEN';

    saveUserToken(token: {token: string}){
        localStorage.setItem(this.key, token.token);
    }

    getUserToken(){
        localStorage.getItem(this.key);
        return 'token';
    }
}

const localStorageManager = new LocalStorage();
export default localStorageManager;
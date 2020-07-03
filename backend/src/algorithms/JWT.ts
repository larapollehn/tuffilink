import Base64 from "./Base64";
import SHA256 from "./SHA256";

export class JWT{
    private readonly secret;
    private readonly ttl;
    base = new Base64();
    sha = new SHA256();

    /**
     * @param secret as a string
     * @param ttl in ms
     */
    constructor(secret: string, ttl: number) {
        this.secret = secret;
        this.ttl = ttl;
    }

    /**
     * generate valid JWT based on given payload
     * @param payload is an object containing the JWT payload
     */
    generate(payload: object): string{
        let header ={
            "alg": "HS256",
            "typ": "JWT"
        };

        let body = JSON.parse(JSON.stringify(payload));
        body['iat'] = Date.now();
        body['exp'] = body['iat']+this.ttl;

        let signature = this.base.encodeBase64(JSON.stringify(header)) + '.' + this.base.encodeBase64(JSON.stringify(body)) + this.secret;
        let hashedSignature = this.sha.hashSHA256(signature);

        return `${this.base.encodeBase64(JSON.stringify(header))}.${this.base.encodeBase64(JSON.stringify(body))}.${hashedSignature}`;
    }

    /**
     * returns the decoded payload from a JWT
     * @param token whose payload shall be returned
     */
    getPayload(token: string): {}{
        let tokenParts = token.split('.');

        if(tokenParts.length !== 3){
            throw new Error('Malformed token');
        }

        let signature = tokenParts[0]+'.'+tokenParts[1]+this.secret;
        let hashedSignature = this.sha.hashSHA256(signature);

        if(hashedSignature !== tokenParts[2]){
            throw new Error('Token not trusted, wrong signature');
        }

        let payload = JSON.parse(this.base.decodeBase64(tokenParts[1]));
        let expirationDate = payload['exp'];
        if (expirationDate < Date.now()){
            throw new Error('Token expired');
        }

        return payload;
    }
}

const JWT_SECRET = process.env.JWT_SECRET;
const TTL = 1000 * 60 * 60 * 24 * 7;
export const jwt = new JWT(JWT_SECRET, TTL);
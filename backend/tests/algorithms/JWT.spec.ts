import JWT from "../../src/algorithms/JWT";
import Base64 from "../../src/algorithms/Base64";
import { v4 as uuidv4 } from 'uuid';

const base64 = new Base64();

let mockPayload = {
    "id": uuidv4(),
    "name": uuidv4()
}

test('JWT generation works', () => {
    const secret = uuidv4();
    const ttl = 60000;
    const jwt = new JWT(secret, ttl);

    let token = jwt.generate(mockPayload);
    let parts = token.split('.');
    expect(parts.length).toBe(3);

    let header = JSON.parse(base64.decodeBase64(parts[0]));
    let payload = JSON.parse(base64.decodeBase64(parts[1]));
    let signature = parts[2];

    expect(payload['id']).toBe(mockPayload['id']);
    expect(payload['name']).toBe(mockPayload['name']);

    expect(header['alg']).toBe('HS256');
    expect(header['typ']).toBe('JWT');

    expect(signature.length).toBe(64);
})

test('Payload from valid token is returned', () => {
    const secret = uuidv4();
    const ttl = 60000;
    const jwt = new JWT(secret, ttl);

    let token = jwt.generate(mockPayload);
    let payload = jwt.getPayload(token);

    expect(payload['id']).toBe(mockPayload['id']);
    expect(payload['name']).toBe(mockPayload['name']);
    expect(payload['iat']).not.toBe(null);
    expect(payload['exp']).not.toBe(null);
})

test('Exception is thrown when trying to get payload from expired token', done => {
    const secret = uuidv4();
    const ttl = 1000;
    const jwt = new JWT(secret, ttl);
    let token = jwt.generate(mockPayload);

    /**
     * to ensure the token expires
     */
    setTimeout(() => {
        expect(() => {jwt.getPayload(token)}).toThrowError(new Error('Token expired'));
        done();
    }, ttl+1);
})

test('Exception is thrown when token is malformed', () => {
    const secret = uuidv4();
    const ttl = 60000;
    const jwt = new JWT(secret, ttl);
    let token = jwt.generate(mockPayload);
    let tokenParts = token.split('.');
    let payload = JSON.parse(base64.decodeBase64(tokenParts[1]));
    payload['role'] = 'admin';

    let wrongToken = tokenParts[0]+'.'+base64.encodeBase64(payload)+'.'+ tokenParts[2];

    expect(() => {jwt.getPayload(wrongToken)}).toThrowError(new Error('Token not trusted, wrong signature'));
    expect(() => {jwt.getPayload(token)}).not.toThrowError();
})


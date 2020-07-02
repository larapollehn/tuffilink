// @ts-ignore
import {crypto} from "crypto";

export default class SHA256{
    hashSHA256(data: string): string {
        const hash = crypto.createHash('sha256');
        return hash.update(data).digest('hex');
    }
}

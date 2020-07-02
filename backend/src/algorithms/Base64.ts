// @ts-ignore
import btoa from 'btoa';
// @ts-ignore
import atob from 'atob';

export default class Base64 {
    /**
     * a string is converted to binary and with base64 encoded to an ascii string
     * @param string is a text string
     */
    encodeBase64(string: string): string {
        return btoa(string);
    }

    /**
     * a given ascii string is is converted to binary and than to a string
     * @param string representing an ascii string
     */
    decodeBase64(string: string): string {
        return atob(string);
    }
}
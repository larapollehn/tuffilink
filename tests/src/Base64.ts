import btoa from "btoa";
import atob from "atob";

export default class Base64 {
    constructor() {
    }

    /**
     * converts a text string to binary string
     * @param text is a string in utf-8/ascii
     */
    private stringToBinary(text: string): string {
        let binaryWords = [];
        text.split(' ')
            .map(word => word.split('')
                .map(char => binaryWords.push(char.charCodeAt(0).toString(2))))
        return String(binaryWords.join(' '));
    }

    /**
     * converts a binary string to a text string
     * @param binary is string containing binary numbers
     */
    private binaryToString(binary: string): string {
        let textFromBinary = [];
        binary.split(' ').map(byte => textFromBinary.push(String.fromCharCode(parseInt(byte, 2))));
        return textFromBinary.join('');
    }

    encodeBase64(string: string): string {
        return btoa(this.stringToBinary(string));
    }

    decodeBase64(string: string): string {
        return this.binaryToString(atob(string));
    }
}

const Base64Converter = new Base64();
let testString = 'https://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript';
let encodedString = Base64Converter.encodeBase64(testString);
console.log(encodedString);
let decodedString = Base64Converter.decodeBase64(encodedString);
console.log(decodedString);
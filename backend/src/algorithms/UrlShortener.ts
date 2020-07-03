import SHA256 from "./SHA256";

export default class UrlShortener{
    private readonly urlLength;
    private sha256 = new SHA256();

    constructor(urlLength: number = 6) {
        this.urlLength = urlLength;
    }

    shortenLink(url: string): string{
        return this.sha256.hashSHA256(url).slice(0, this.urlLength);
    }
}

export const url = new UrlShortener();

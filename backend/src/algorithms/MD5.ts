import {Md5} from 'ts-md5/dist/md5'

export default class MD5{
    hashMD5(data: string) {
        return Md5.hashStr(data);
    }
}
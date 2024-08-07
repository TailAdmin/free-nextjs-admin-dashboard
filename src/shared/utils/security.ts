import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY || '';
const ALGORITHM = 'aes-128-ecb';


export function encryptECB(data: string): string {
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
    const paddedData = Buffer.from(pad(data));
    let encrypted = cipher.update(paddedData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export function decryptECB(encryptedData: string): string {
    console.log('encryptECB', encryptedData);
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
    const encryptedBuffer = Buffer.from(encryptedData, 'hex');
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return unpad(decrypted.toString('utf8'));
}

function pad(data: string): string {
    const blockSize = 16;
    const padding = blockSize - (data.length % blockSize);
    const padString = String.fromCharCode(padding);
    return data + padString.repeat(padding);
}

function unpad(data: string): string {
    const padding = data.charCodeAt(data.length - 1);
    return data.slice(0, -padding);
}

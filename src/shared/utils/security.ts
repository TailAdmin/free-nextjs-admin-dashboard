import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY || 'SIXTEEN BYTE KEY';
const ALGORITHM = 'aes-128-ecb';


export function encryptECB(data: string): string {
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptECB(encryptedData: string): string {

    if (encryptedData === '') {
        return encryptedData;
    }
        try {
            const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } 
        catch (error) {
            console.error('Error decrypting data', error);
            return encryptedData;
        } 

}

function pad(data: string): string {
    const blockSize = 16;
    const padding = blockSize - (data.length % blockSize);
    const padString = String.fromCharCode(padding);
    return data + padString.repeat(padding);
}


import crypto from 'crypto';

let ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY;
const ALGORITHM = 'aes-128-ecb';

export function encryptECB(data: string): string {
    if (!ENCRYPTION_KEY){
        ENCRYPTION_KEY = 'SIXTEEN BYTE KEY';
    }
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptECB(encryptedData: string): string {
    if (!ENCRYPTION_KEY){
        ENCRYPTION_KEY = 'SIXTEEN BYTE KEY';
    }
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
            console.error('Error decrypting data as hex', error);
        } 

        try {
            const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } 
        catch (error) {
            console.error('Error decrypting data as base64', error);
            return encryptedData;
        } 

}

export function decryptECBWithHash(encryptedData: string): string {
    if (!encryptedData) {
        return encryptedData;
    }

    if(!ENCRYPTION_KEY){
        ENCRYPTION_KEY = '';
    }

    const secretKey = hashSecretKey(ENCRYPTION_KEY)
    try {

        const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, secretKey.slice(0,16));

        const decodedData = Buffer.from(encryptedData, 'base64');
        let decryptedData = decipher.update(decodedData);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        
        return decryptedData.toString('utf8');
    } catch (err) {
        console.error(err);
        return encryptedData;
    }
}

function hashSecretKey(secretKey: string): Buffer {
    const hash = crypto.createHash('sha256');   
    
    hash.update(secretKey);
    
    return hash.digest();
}
import crypto from 'crypto';
import logger from '@/shared/utils/logger';

let ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY;
const ALGORITHM = 'aes-128-ecb';

export function encryptECB(data: string): string {
    
    try{
        if (!ENCRYPTION_KEY){
            ENCRYPTION_KEY = 'SIXTEEN BYTE KEY';
        }
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    catch(error: unknown) {
        if (error instanceof Error) {
            logger.error( {
                msg: 'Error encrypting data',
                value: data,
                error: error.message,
            });
        }
        else{

            logger.error('An unknown error occurred during encrypting');
        } 
        return data;

    }   
}

export function decryptECB(encryptedData: string): string {
    if (!encryptedData) {
        return encryptedData;
    }
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
        catch (error:unknown) {
            if (error instanceof Error) {
                logger.error( {
                    msg: 'Error decrypting data as hex',
                    value: encryptedData,
                    error: error.message,
                });
            }
            else{

                logger.error('An unknown error occurred during decrypting ECB');
            } 
            
        } 

        try {
            const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), null);
            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } 
        catch (error:unknown) {
            if (error instanceof Error) {
                logger.error({
                    msg: 'Error decrypting data as base64',
                    value: encryptedData,
                    error: error.message,
                });
            }else{

                logger.error('An unknown error occurred during decrypting ECB');
            }
            return encryptedData; 
        } 

}
export function encryptCBC(data: string):string{

    if (!data) {
        return data;
    }
    let cbcEnctyptionKey = '';
    if(ENCRYPTION_KEY){
        const cbcEnctyptionKey = ENCRYPTION_KEY
    }
    const secretKey = hashSecretKey(cbcEnctyptionKey)
    try{
        console.log('secretKey', secretKey)
        console.log('cbcEnctyptionKey', cbcEnctyptionKey)
        console.log('data', data)
        const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, secretKey.slice(0,16));
        
        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        console.log("encrypted", encrypted);
        
        return encrypted;

    }catch(error:unknown){
        if (error instanceof Error) {
            logger.error( {
                msg: 'Error encrypting data',
                value: data,
                error: error.message,
            });
        }
        else{

            logger.error('An unknown error occurred during encrypting');
        } 
        return data;

    }

}

export function decryptCBC(encryptedData: string): string {
    if (!encryptedData) {
        return encryptedData;
    }
    let cbcEnctyptionKey = '';
    if(ENCRYPTION_KEY){
        cbcEnctyptionKey = ENCRYPTION_KEY
    }

    const secretKey = hashSecretKey(cbcEnctyptionKey)
    try {

        const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, secretKey.slice(0,16));

        const decodedData = Buffer.from(encryptedData, 'base64');
        let decryptedData = decipher.update(decodedData);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        
        return decryptedData.toString('utf8');
    } 
    catch (error:unknown) {
        if (error instanceof Error) {
            logger.error({
                msg: 'Error decrypting data',
                value: encryptedData,
                error: error.message,
            });
        }else{

            logger.error('An unknown error occurred during decrypting CBC');
        }
        return encryptedData; 
    } 
}

function hashSecretKey(secretKey: string): Buffer {
    const hash = crypto.createHash('sha256');   
    
    hash.update(secretKey);
    
    return hash.digest();
}
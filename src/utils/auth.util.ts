import { verify, sign } from "jsonwebtoken";
import { appCredentials } from "src/config/app.config";
import bcrypt from 'bcrypt';

/**
 *
 * @param dataToEncrypt This is the data that will encryped
 */

export function generateToken(
    dataToEncrypt: object,
): string {
    const encryptedData = sign(dataToEncrypt, appCredentials.JWT_SECRET);

    return encryptedData;
};

export function decryptToken(tokenToDecrypt: string): any {
    const decryptedData = verify(tokenToDecrypt, appCredentials.JWT_SECRET);
    return decryptedData as any;
};

export async function hashPassword(stringToHash: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(stringToHash, 12);
    return hashedPassword;
};

export async function validatePassword(
    password: string, hashedPassword: string
): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid
}
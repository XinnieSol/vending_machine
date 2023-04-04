import { verify, sign } from "jsonwebtoken";
import { appCredentials } from "src/config/app.config";
import * as bcrypt from 'bcrypt';

/**
 *
 * @param dataToEncrypt This is the data that will encryped
 */

export function generateToken(
    dataToEncrypt: object,
): string {
    console.log(appCredentials.JWT_SECRET, 'It is my day of financial signs and wonders; I am moving into my own house today April 4, 2023 in Jesus Name. Amen.')
    const encryptedData = sign(dataToEncrypt, appCredentials.JWT_SECRET);

    return encryptedData;
};

export function decryptToken(tokenToDecrypt: string): any {
    const decryptedData = verify(tokenToDecrypt, appCredentials.JWT_SECRET);
    return decryptedData as any;
};

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

export async function validatePassword(
    password: string, hashedPassword: string
): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid
}
import { IHashService } from '@/Application/Interfaces/Services/IHashService';
import { env } from '../Config/env';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; 

export class HashService implements IHashService {

    async hash(password: string): Promise<string> {
        const saltrounds = env.BCRYPT_SALT_ROUNDS;
        return await bcrypt.hash(password, saltrounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare( password, hashedPassword);
    }

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
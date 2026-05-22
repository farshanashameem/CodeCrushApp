export interface IHashService {
    hash(password: string) : Promise<string>;
    hashToken ( token: string ): string;
    compare( password: string, hashedPassword: string): Promise<boolean>;
}
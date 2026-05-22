export interface IOTPStore {
    saveOTP( email: string, hashedOTP: string, ttlSeconds: number) : Promise<void>;
    getOTP( email: string ) : Promise<string | null >;
    deleteOTP( email: string ): Promise<void>;
}
export interface IOTPService {
  generateOTP(): string;
  hash( otp: string ): Promise<string>;
  compare( EnteredOTP: string, hashedOTP: string ): Promise< boolean>;
}
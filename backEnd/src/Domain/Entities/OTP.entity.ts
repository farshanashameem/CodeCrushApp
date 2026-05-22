import OTPType from "../enums/OTPType.enum";

export class OTPEntity {
    private name?: string;
    private email: string;
    private password?: string;
    private otp: string;
    private otpExpiry: Date;
    private resendCount: number;
    private type: OTPType;
    private createdAt: Date;
    constructor(
        
        email: string,
        otp: string,
        otpExpiry: Date,
        resendCount: number=0,
        type: OTPType,
        createdAt: Date,
        name?: string,
        password?: string
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.otp = otp;
        this.otpExpiry = otpExpiry;
        this.resendCount = resendCount;
        this.type = type;
        this.createdAt = createdAt;
    }

    public getName(): string | undefined {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string | undefined {
        return this.password;
    }

    public getOtp() : string {
        return this.otp;
    }

    public getOtpExpiry() : Date {
        return this.otpExpiry;
    }

    public getResendCount(): number {
        return this.resendCount;
    }

    public getType() : OTPType {
        return this.type;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public isOtpExpired(): boolean {
        return new Date()>this.otpExpiry;
    }

    public canResendOtp(): boolean {
        return this.resendCount < 5;
    }
}
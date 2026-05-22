import { IEmailService } from "@/Application/Interfaces/Services/IEmailService";
import { mailTransporter } from "../Config/mail.config";
import { env } from "../Config/env";
import { OTPMailTemplate } from "../EmailTemplates/OTPTemplate";

export class MailService implements IEmailService {
    async sendOTP(email: string, otp: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"CodeCrush" <${env.EMAIL_USER}>`,
            to: email,
            subject: "Your otp code",
            html:OTPMailTemplate(otp)
        })
    }

    
}
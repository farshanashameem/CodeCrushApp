import { IEmailService } from '@/Application/Interfaces/Services/IEmailService';
import { mailTransporter } from '../Config/mail.config';
import { env } from '../Config/env';
import { OTPMailTemplate } from '../EmailTemplates/OTPTemplate';
import { WeeklyProgressReportDTO } from '@/Application/Cron/dto/WeeklyProgressReport.dto';
import { WeeklyProgressReportTemplate } from '../EmailTemplates/WeeklyProgressReportTemplate';
import { SubscriptionExpiredNotificationDTO, SubscriptionExpiryReminderDTO } from '@/Application/Cron/dto/SubscriptionReminder.dto';
import { SubscriptionExpiryReminderTemplate } from '../EmailTemplates/SubscriptionExpiryReminderTemplate';
import { SubscriptionExpiredTemplate } from '../EmailTemplates/SubscriptionExpiredTemplate';

export class MailService implements IEmailService {
    async sendOTP(email: string, otp: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"CodeCrush" <${env.EMAIL_USER}>`,
            to: email,
            subject: 'Your otp code',
            html:OTPMailTemplate(otp)
        });
    }

    async sendWeeklyProgressReport(report: WeeklyProgressReportDTO) {
        
        await mailTransporter.sendMail({
            from: `"CodeCrush" <${env.EMAIL_USER}>`,
            to: report.parentEmail,
            subject: "📊 Your Child's Weekly Progress Report",
            html: WeeklyProgressReportTemplate(report),
        });
    }

    async sendSubscriptionExpiryReminder(dto: SubscriptionExpiryReminderDTO): Promise<void> {
         await mailTransporter.sendMail({
            from: `"CodeCrush" <${env.EMAIL_USER}>`,
            to: dto.parentEmail,
            subject: '⏰ Your CodeCrush Premium Subscription Expires Tomorrow',
            html: SubscriptionExpiryReminderTemplate(dto),
        });


    }

    async sendSubscriptionExpiredNotification( dto: SubscriptionExpiredNotificationDTO ): Promise<void> {

    await mailTransporter.sendMail({
        from: `"CodeCrush" <${env.EMAIL_USER}>`,
        to: dto.parentEmail,
        subject: '❌ Your CodeCrush Premium Subscription Has Expired',
        html: SubscriptionExpiredTemplate(dto),
    });

}
    
}
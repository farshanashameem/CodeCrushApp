import { SubscriptionExpiredNotificationDTO, SubscriptionExpiryReminderDTO } from '@/Application/Cron/dto/SubscriptionReminder.dto';
import { WeeklyProgressReportDTO } from '@/Application/Cron/dto/WeeklyProgressReport.dto';

export interface IEmailService {
  sendOTP(email: string, otp: string): Promise<void>;
  sendWeeklyProgressReport( report: WeeklyProgressReportDTO);
  sendSubscriptionExpiryReminder( dto: SubscriptionExpiryReminderDTO ): Promise<void>;
  sendSubscriptionExpiredNotification( dto: SubscriptionExpiredNotificationDTO ): Promise<void>;

}
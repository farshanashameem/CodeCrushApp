export interface ICronJobService {
    sendWeeklyProgressReports(): Promise<void>;

    sendMonthlyProgressReports(): Promise<void>;

    sendSubscriptionExpiryReminders(): Promise<void>;

    sendSubscriptionExpiredNotifications(): Promise<void>;

    sendBirthdayWishes(): Promise<void>;

    sendInactiveChildReminders(): Promise<void>;
}
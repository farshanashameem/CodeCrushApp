export interface SubscriptionExpiryReminderDTO {
    parentName: string;
    parentEmail: string;
    expiryDate: Date;
}

export interface SubscriptionExpiredNotificationDTO {
    parentName: string;
    parentEmail: string;
    expiredDate: Date;
}
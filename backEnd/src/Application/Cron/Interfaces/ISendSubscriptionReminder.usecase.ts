export interface ISendSubscriptionExpiryReminderUseCase {
    execute(): Promise<void>;
}
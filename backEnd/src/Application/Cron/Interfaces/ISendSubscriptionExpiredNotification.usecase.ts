export interface ISendSubscriptionExpiredNotificationUseCase {
    execute(): Promise<void>;
}
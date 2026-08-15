import { IParentRepository } from '@/Domain/RepositoryInterface/IParent.repository';
import { IEmailService } from '@/Application/Interfaces/Services/IEmailService';
import { ISendSubscriptionExpiredNotificationUseCase } from '../Interfaces/ISendSubscriptionExpiredNotification.usecase';

export class SendSubscriptionExpiredNotificationUseCase
    implements ISendSubscriptionExpiredNotificationUseCase {

    constructor(
        private readonly _parentRepo: IParentRepository,
        private readonly _mailService: IEmailService
    ) {}

    async execute(): Promise<void> {

        const today = new Date();

        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const parents =
            await this._parentRepo.findPremiumParentsExpiredBetween(
                startOfDay,
                endOfDay
            );

        for (const parent of parents) {

            const expiryDate = parent.getSubscriptionExpiryDate();

            if (!expiryDate) {
                continue;
            }

            await this._mailService.sendSubscriptionExpiredNotification({
                parentName: parent.getName(),
                parentEmail: parent.getEmail(),
                expiredDate: expiryDate,
            });
        }
    }
}
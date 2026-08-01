import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { ISendSubscriptionExpiryReminderUseCase } from "../Interfaces/ISendSubscriptionReminder.usecase";
import { IEmailService } from "@/Application/Interfaces/Services/IEmailService";

export class SendSubscriptionExpiryReminderUseCase implements ISendSubscriptionExpiryReminderUseCase {
    constructor (
        private _parentRepo: IParentRepository,
        private _mailService: IEmailService
    ) {}
    async execute(): Promise<void> {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfDay = new Date(tomorrow);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(tomorrow);
        endOfDay.setHours(23, 59, 59, 999);

        const parents = await this._parentRepo.findPremiumParentsExpiringBetween( startOfDay, endOfDay );
        for (const parent of parents) {

            const expiryDate = parent.getSubscriptionExpiryDate();

            if (!expiryDate) {
                continue;
            }

            await this._mailService.sendSubscriptionExpiryReminder({
                parentName: parent.getName(),
                parentEmail: parent.getEmail(),
                expiryDate,
            });
        }
    }
}
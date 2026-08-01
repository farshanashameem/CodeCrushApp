import { CleanupDeletedRecordsUseCase } from "@/Application/Cron/UseCases/CleanUpDeletedRecords.usecase";
import { SendSubscriptionExpiredNotificationUseCase } from "@/Application/Cron/UseCases/SendSubscriptionExpired.usecase";
import { SendSubscriptionExpiryReminderUseCase } from "@/Application/Cron/UseCases/SendSubscriptionExpiryReminder.usecase";
import { SendWeeklyProgressReportUseCase } from "@/Application/Cron/UseCases/SendWeeklyProgressReport.usecase";
import { CronScheduler } from "@/Infrastructure/Cron/CronScheduler";
import { ChildRepository } from "@/Infrastructure/Repositories/Child.repository";
import { ParentRepository } from "@/Infrastructure/Repositories/Parent.repository";
import { ProgressRepository } from "@/Infrastructure/Repositories/Progress.repository";
import { MailService } from "@/Infrastructure/Services/MailService";

const mailService = new MailService();

const parentRepository = new ParentRepository();
const childrepository = new ChildRepository();
const progressRepository = new ProgressRepository();

const weeklyReportUseCase = new SendWeeklyProgressReportUseCase(
    parentRepository,
    childrepository,
    progressRepository,
    mailService
);

const subscriptionReminderUseCase = new SendSubscriptionExpiryReminderUseCase(
    parentRepository,
    mailService
);

const subscriptionExpiredUseCase = new SendSubscriptionExpiredNotificationUseCase(
    parentRepository,
    mailService
);

const cleanupDeletedRecordsUseCase = new CleanupDeletedRecordsUseCase(
    parentRepository,
    childrepository
)

 CronScheduler(
    weeklyReportUseCase,
    subscriptionReminderUseCase,
    subscriptionExpiredUseCase,
    cleanupDeletedRecordsUseCase
);

export const initializeCronScheduler = () => {
    CronScheduler(
        weeklyReportUseCase,
        subscriptionReminderUseCase,
        subscriptionExpiredUseCase,
        cleanupDeletedRecordsUseCase
    );
};

// Infrastructure/Cron/CronScheduler.ts

import cron from "node-cron";

import { ISendWeeklyProgressReportUseCase } from "@/Application/Cron/Interfaces/ISendWeeklyProgressReport.usecase";
import { ISendSubscriptionExpiryReminderUseCase } from "@/Application/Cron/Interfaces/ISendSubscriptionReminder.usecase";
import { ISendSubscriptionExpiredNotificationUseCase } from "@/Application/Cron/Interfaces/ISendSubscriptionExpiredNotification.usecase";
import logger from "../Services/Logger";
import { ICleanupDeletedRecordsUseCase } from "@/Application/Cron/Interfaces/ICleanupDeletedRecods.usecase";

export const CronScheduler = (
    weeklyReportUseCase: ISendWeeklyProgressReportUseCase,
    subscriptionReminderUseCase: ISendSubscriptionExpiryReminderUseCase,
    subscriptionExpiredUseCase: ISendSubscriptionExpiredNotificationUseCase,
    cleanupDeletedRecordsUseCase: ICleanupDeletedRecordsUseCase
) => {

    // Every Sunday at 8:00 AM
    cron.schedule("0 8 * * 0", async () => {
        try {
            logger.info("Running Weekly Progress Report Job...");
            await weeklyReportUseCase.execute();
            logger.info("Weekly Progress Report Job Completed.");
        } catch (error) {
            logger.error({error},"Weekly Progress Report Job Failed:");
        }
    });

    // Every day at 9:00 AM
    cron.schedule("0 9 * * *", async () => {
        try {
            logger.info("Running Subscription Reminder Job...");
            await subscriptionReminderUseCase.execute();
            logger.info("Subscription Reminder Job Completed.");
        } catch (error) {
            logger.error({error},"Subscription Reminder Job Failed:");
        }
    });

    // Every day at 9:05 AM
    cron.schedule("5 9 * * *", async () => {
        try {
            logger.info("Running Subscription Expired Job...");
            await subscriptionExpiredUseCase.execute();
            logger.info("Subscription Expired Job Completed.");
        } catch (error) {
            logger.error({error},"Subscription Expired Job Failed:");
        }
    });

    cron.schedule("0 2 * * *", async () => {
        try {
            logger.info("Running Cleanup Job...");
            await cleanupDeletedRecordsUseCase.execute();
            logger.info("Cleanup Job Completed.");
        } catch (error) {
            logger.error({ error }, "Cleanup Job Failed");
        }
    });

    logger.info("✅ Cron Jobs Initialized");
};
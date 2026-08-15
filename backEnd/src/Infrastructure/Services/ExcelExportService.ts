import ExcelJS from 'exceljs';

import { RevenueReportData } from '@/Domain/Types/RevenueReport';
import { IExcelExportService } from '@/Application/Interfaces/Services/IExcelExportService';
import { UserReportData } from '@/Domain/Types/UserReport';
import { ChildProgressReportData } from '@/Domain/Types/ChildReports';
import { GamePerformanceReportData } from '@/Domain/Types/GameReport';
import { LevelPerformanceReportData } from '@/Domain/Types/LevelReport';
import { ReportExportDTO } from '@/Application/Admin/dto/exportReport.dto';

export class ExcelExportService implements IExcelExportService {

    async exportUserReport( report: UserReportData, input: ReportExportDTO ): Promise<Buffer> {

        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'CodeCrush';
        workbook.created = new Date();

        const summarySheet = this.createReportSheet(
            workbook,
            'Summary',
            'User Report',
            input
        );

        this.addSectionTitle(
            summarySheet,
            'Summary'
        );

        this.setColumnWidths(summarySheet, [
            { key: 'metric', width: 35 },
            { key: 'value', width: 20 },
        ]);

        this.addTableHeader(summarySheet, [
            'Metric',
            'Value',
        ]);

        summarySheet.addRows([
            {
                metric: 'Total Parents',
                value: report.metrics.totalParents,
            },
            {
                metric: 'Active Parents',
                value: report.metrics.activeParents,
            },
            {
                metric: 'New Registrations',
                value: report.metrics.newRegistrations,
            },
            {
                metric: 'Blocked Parents',
                value: report.metrics.blockedParents,
            },
            {
                metric: 'Premium Parents',
                value: report.metrics.premiumParents,
            },
            {
                metric: 'Free Parents',
                value: report.metrics.freeParents,
            },
        ]);

        const analyticsSheet = this.createReportSheet(
            workbook,
            'Analytics',
            'User Report',
            input
        );

        this.addSectionTitle(
            analyticsSheet,
            'User Growth'
        );

        this.setColumnWidths(analyticsSheet, [
            { key: 'label', width: 25 },
            { key: 'count', width: 20 },
        ]);

        this.addTableHeader(analyticsSheet, [
            'Label',
            'Users',
        ]);

        report.userGrowth.forEach(item => {
            analyticsSheet.addRow({
                label: item.label,
                count: item.count,
            });
        });

        this.addBlankRows(analyticsSheet, 3);

        this.addSectionTitle(
            analyticsSheet,
            'Subscription Distribution'
        );

        this.addTableHeader(analyticsSheet, [
            'Subscription',
            'Users',
        ]);

        analyticsSheet.addRow([
            'Premium',
            report.subscriptionDistribution.premium,
        ]);

        analyticsSheet.addRow([
            'Free',
            report.subscriptionDistribution.free,
        ]);

        const buffer = await workbook.xlsx.writeBuffer();

        return Buffer.from(buffer);
    }

    async exportChildReport( report: ChildProgressReportData, input: ReportExportDTO ): Promise<Buffer> {

        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'CodeCrush';
        workbook.created = new Date();

        /* ==========================================================
          Summary
        ========================================================== */

        const summarySheet = this.createReportSheet(
            workbook,
            'Summary',
            'Child Progress Report',
            input
        );

        this.addSectionTitle(summarySheet, 'Summary');

        this.setColumnWidths(summarySheet, [
            { key: 'metric', width: 35 },
            { key: 'value', width: 20 },
        ]);

        this.addTableHeader(summarySheet, [
            'Metric',
            'Value',
        ]);

        summarySheet.addRows([
            {
                metric: 'Total Children',
                value: report.metrics.totalChildren,
            },
            {
                metric: 'Active Children',
                value: report.metrics.activeChildren,
            },
            {
                metric: 'Average Best Time (sec)',
                value: report.metrics.averageBestTime,
            },
            {
                metric: 'Average Score',
                value: report.metrics.averageScore,
            },
            {
                metric: 'Average Completed Levels',
                value: report.metrics.averageCompletedLevels,
            },
        ]);

        /* ==========================================================
          Analytics
        ========================================================== */

        const analyticsSheet = this.createReportSheet(
            workbook,
            'Analytics',
            'Child Progress Report',
            input
        );

        this.setColumnWidths(analyticsSheet, [
            { key: 'label', width: 25 },
            { key: 'value', width: 20 },
        ]);

        /* ---------- Daily Activity ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Daily Activity'
        );

        this.addTableHeader(analyticsSheet, [
            'Label',
            'Active Children',
        ]);

        report.dailyActivity.forEach(item => {
            analyticsSheet.addRow({
                label: item.label,
                value: item.activeChildren,
            });
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Score Trend ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Score Trend'
        );

        this.addTableHeader(analyticsSheet, [
            'Label',
            'Average Score',
        ]);

        report.scoreTrend.forEach(item => {
            analyticsSheet.addRow({
                label: item.label,
                value: item.averageScore,
            });
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Game Popularity ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Game Popularity'
        );

        this.addTableHeader(analyticsSheet, [
            'Game',
            'Plays',
        ]);

        report.gamePopularity.forEach(item => {
            analyticsSheet.addRow([
                item.game,
                item.plays,
            ]);
        });

        /* ==========================================================
          Top Children
        ========================================================== */

        const topChildrenSheet = this.createReportSheet(
            workbook,
            'Top Children',
            'Child Progress Report',
            input
        );

        this.addSectionTitle(
            topChildrenSheet,
            'Top Performing Children'
        );

        this.setColumnWidths(topChildrenSheet, [
            { key: 'child', width: 25 },
            { key: 'parent', width: 25 },
            { key: 'score', width: 18 },
            { key: 'levels', width: 20 },
            { key: 'playTime', width: 18 },
        ]);

        this.addTableHeader(topChildrenSheet, [
            'Child',
            'Parent',
            'Average Score',
            'Completed Levels',
            'Play Time',
        ]);

        report.topChildren.forEach(child => {
            topChildrenSheet.addRow({
                child: child.name,
                parent: child.parentName,
                score: child.averageScore,
                levels: child.completedLevels,
                playTime: this.formatDuration(child.totalPlayTime),
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return Buffer.from(buffer);
    }

    async exportGameReport( report: GamePerformanceReportData, input: ReportExportDTO ): Promise<Buffer> {

        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'CodeCrush';
        workbook.created = new Date();

        /* ==========================================================
          Summary
        ========================================================== */

        const summarySheet = this.createReportSheet(
            workbook,
            'Summary',
            'Game Performance Report',
            input
        );

        this.addSectionTitle(summarySheet, 'Summary');

        this.setColumnWidths(summarySheet, [
            { key: 'metric', width: 35 },
            { key: 'value', width: 20 },
        ]);

        this.addTableHeader(summarySheet, [
            'Metric',
            'Value',
        ]);

        summarySheet.addRows([
            {
                metric: 'Total Games',
                value: report.metrics.totalGames,
            },
            {
                metric: 'Total Levels',
                value: report.metrics.totalLevels,
            },
            {
                metric: 'Total Plays',
                value: report.metrics.totalPlays,
            },
            {
                metric: 'Average Score',
                value: report.metrics.averageScore,
            },
            {
                metric: 'Average Completion Rate (%)',
                value: report.metrics.averageCompletionRate,
            },
            {
                metric: 'Average Attempts',
                value: report.metrics.averageAttempts,
            },
        ]);

        /* ==========================================================
          Analytics
        ========================================================== */

        const analyticsSheet = this.createReportSheet(
            workbook,
            'Analytics',
            'Game Performance Report',
            input
        );

        this.setColumnWidths(analyticsSheet, [
            { key: 'label', width: 30 },
            { key: 'value', width: 20 },
        ]);

        /* ---------- Game Plays ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Game Plays'
        );

        this.addTableHeader(analyticsSheet, [
            'Game',
            'Plays',
        ]);

        report.gamePlays.forEach(item => {
            analyticsSheet.addRow([
                item.game,
                item.plays,
            ]);
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Completion Rate ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Completion Rate'
        );

        this.addTableHeader(analyticsSheet, [
            'Game',
            'Completion Rate (%)',
        ]);

        report.completionRate.forEach(item => {
            analyticsSheet.addRow([
                item.game,
                item.completionRate,
            ]);
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Average Score By Game ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Average Score By Game'
        );

        this.addTableHeader(analyticsSheet, [
            'Game',
            'Average Score',
        ]);

        report.scoreByGame.forEach(item => {
            analyticsSheet.addRow([
                item.game,
                item.averageScore,
            ]);
        });

        /* ==========================================================
          Top Games
        ========================================================== */

        const topGamesSheet = this.createReportSheet(
            workbook,
            'Top Games',
            'Game Performance Report',
            input
        );

        this.addSectionTitle(
            topGamesSheet,
            'Top Performing Games'
        );

        this.setColumnWidths(topGamesSheet, [
            { key: 'game', width: 30 },
            { key: 'plays', width: 18 },
            { key: 'score', width: 18 },
            { key: 'completion', width: 22 },
            { key: 'attempts', width: 20 },
        ]);

        this.addTableHeader(topGamesSheet, [
            'Game',
            'Total Plays',
            'Average Score',
            'Completion Rate (%)',
            'Average Attempts',
        ]);

        report.topGames.forEach(game => {
            topGamesSheet.addRow({
                game: game.gameName,
                plays: game.totalPlays,
                score: game.averageScore,
                completion: game.completionRate,
                attempts: game.averageAttempts,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return Buffer.from(buffer);
    }

    async exportLevelReport( report: LevelPerformanceReportData, input: ReportExportDTO ): Promise<Buffer> {

        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'CodeCrush';
        workbook.created = new Date();

        /* ==========================================================
          Summary
        ========================================================== */

          const summarySheet = this.createReportSheet(
              workbook,
              'Summary',
              'Level Performance Report',
              input,
              {
                  Game: input.gameName ?? '-',
              }
          );

        this.addSectionTitle(summarySheet, 'Summary');

        this.setColumnWidths(summarySheet, [
            { key: 'metric', width: 35 },
            { key: 'value', width: 20 },
        ]);

        this.addTableHeader(summarySheet, [
            'Metric',
            'Value',
        ]);

        summarySheet.addRows([
            {
                metric: 'Total Levels',
                value: report.metrics.totalLevels,
            },
            {
                metric: 'Total Attempts',
                value: report.metrics.totalAttempts,
            },
            {
                metric: 'Total Completions',
                value: report.metrics.totalCompletions,
            },
            {
                metric: 'Average Success Rate (%)',
                value: report.metrics.averageSuccessRate,
            },
            {
                metric: 'Average Score',
                value: report.metrics.averageScore,
            },
        ]);

        /* ==========================================================
          Analytics
        ========================================================== */
          const analyticsSheet = this.createReportSheet(
              workbook,
              'Analytics',
              'Level Performance Report',
              input,
              {
                  Game: input.gameName ?? '-',
              }
          );

        this.setColumnWidths(analyticsSheet, [
            { key: 'label', width: 30 },
            { key: 'value', width: 20 },
        ]);

        /* ---------- Attempts ---------- */

        this.addSectionTitle(analyticsSheet, 'Attempts');

        this.addTableHeader(analyticsSheet, [
            'Level',
            'Attempts',
        ]);

        report.attemptsChart.forEach(item => {
            analyticsSheet.addRow([
                item.label,
                item.attempts,
            ]);
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Success Rate ---------- */

        this.addSectionTitle(analyticsSheet, 'Success Rate');

        this.addTableHeader(analyticsSheet, [
            'Level',
            'Success Rate (%)',
        ]);

        report.successRateChart.forEach(item => {
            analyticsSheet.addRow([
                item.label,
                item.successRate,
            ]);
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Average Score ---------- */

        this.addSectionTitle(analyticsSheet, 'Average Score');

        this.addTableHeader(analyticsSheet, [
            'Level',
            'Average Score',
        ]);

        report.averageScoreChart.forEach(item => {
            analyticsSheet.addRow([
                item.label,
                item.averageScore,
            ]);
        });

        /* ==========================================================
          Hardest Levels
        ========================================================== */

          const hardestSheet = this.createReportSheet(
              workbook,
              'Hardest Levels',
              'Level Performance Report',
              input,
              {
                  Game: input.gameName ?? '-',
              }
          );

        this.addSectionTitle(hardestSheet, 'Hardest Levels');

        this.setColumnWidths(hardestSheet, [
            { key: 'level', width: 30 },
            { key: 'difficulty', width: 18 },
            { key: 'attempts', width: 20 },
            { key: 'success', width: 20 },
        ]);

        this.addTableHeader(hardestSheet, [
            'Level',
            'Difficulty',
            'Average Attempts',
            'Success Rate (%)',
        ]);

        report.hardestLevels.forEach(level => {
            hardestSheet.addRow({
                level: level.levelName,
                difficulty: level.difficulty,
                attempts: level.averageAttempts,
                success: level.successRate,
            });
        });

        /* ==========================================================
          Most Completed Levels
        ========================================================== */

          const completedSheet = this.createReportSheet(
              workbook,
              'Most Completed Levels',
              'Level Performance Report',
              input,
              {
                  Game: input.gameName ?? '-',
              }
          );

        this.addSectionTitle(completedSheet, 'Most Completed Levels');

        this.setColumnWidths(completedSheet, [
            { key: 'level', width: 30 },
            { key: 'difficulty', width: 18 },
            { key: 'players', width: 22 },
            { key: 'completion', width: 22 },
            { key: 'score', width: 18 },
        ]);

        this.addTableHeader(completedSheet, [
            'Level',
            'Difficulty',
            'Completed Players',
            'Completion Rate (%)',
            'Average Score',
        ]);

        report.mostCompletedLevels.forEach(level => {
            completedSheet.addRow({
                level: level.levelName,
                difficulty: level.difficulty,
                players: level.completedPlayers,
                completion: level.completionRate,
                score: level.averageScore,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return Buffer.from(buffer);
    }

    async exportRevenueReport(
        report: RevenueReportData,
        input: ReportExportDTO
    ): Promise<Buffer> {

        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'CodeCrush';
        workbook.created = new Date();

        /* ==========================================================
          Summary
        ========================================================== */

        const summarySheet = this.createReportSheet(
            workbook,
            'Summary',
            'Revenue Report',
            input
        );

        this.addSectionTitle(summarySheet, 'Summary');

        this.setColumnWidths(summarySheet, [
            { key: 'metric', width: 35 },
            { key: 'value', width: 20 },
        ]);

        this.addTableHeader(summarySheet, [
            'Metric',
            'Value',
        ]);

        summarySheet.addRows([
            {
                metric: 'Total Revenue',
                value: report.metrics.totalRevenue,
            },
            {
                metric: 'Total Purchases',
                value: report.metrics.totalPurchases,
            },
            {
                metric: 'Premium Subscribers',
                value: report.metrics.premiumSubscribers,
            },
            {
                metric: 'Average Purchase Value',
                value: report.metrics.averagePurchaseValue,
            },
        ]);

        /* ==========================================================
          Analytics
        ========================================================== */

        const analyticsSheet = this.createReportSheet(
            workbook,
            'Analytics',
            'Revenue Report',
            input
        );

        this.setColumnWidths(analyticsSheet, [
            { key: 'label', width: 30 },
            { key: 'value', width: 20 },
        ]);

        /* ---------- Revenue Trend ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Revenue Trend'
        );

        this.addTableHeader(analyticsSheet, [
            'Date',
            'Revenue',
        ]);

        report.revenueTrend.forEach(item => {
            analyticsSheet.addRow([
                item.label,
                item.revenue,
            ]);
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Revenue By Plan ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Revenue By Plan'
        );

        this.addTableHeader(analyticsSheet, [
            'Plan',
            'Revenue',
        ]);

        report.revenueByPlan.forEach(item => {
            analyticsSheet.addRow([
                item.plan,
                item.revenue,
            ]);
        });

        this.addBlankRows(analyticsSheet, 3);

        /* ---------- Plan Distribution ---------- */

        this.addSectionTitle(
            analyticsSheet,
            'Plan Distribution'
        );

        this.addTableHeader(analyticsSheet, [
            'Plan',
            'Purchases',
        ]);

        report.planDistribution.forEach(item => {
            analyticsSheet.addRow([
                item.plan,
                item.purchases,
            ]);
        });

        /* ==========================================================
          Recent Transactions
        ========================================================== */

        const transactionSheet = this.createReportSheet(
            workbook,
            'Recent Transactions',
            'Revenue Report',
            input
        );

        this.addSectionTitle(
            transactionSheet,
            'Recent Transactions'
        );

        this.setColumnWidths(transactionSheet, [
            { key: 'parent', width: 25 },
            { key: 'plan', width: 20 },
            { key: 'amount', width: 18 },
            { key: 'date', width: 25 },
        ]);

        this.addTableHeader(transactionSheet, [
            'Parent',
            'Plan',
            'Amount',
            'Purchased At',
        ]);

        report.recentTransactions.forEach(item => {
            transactionSheet.addRow({
                parent: item.parentName,
                plan: item.plan,
                amount: item.amount,
                date: item.purchasedAt,
            });
        });

        transactionSheet.getColumn('date').numFmt = 'dd/mm/yyyy hh:mm';

        /* ==========================================================
          Top Paying Parents
        ========================================================== */

        const topParentsSheet = this.createReportSheet(
            workbook,
            'Top Paying Parents',
            'Revenue Report',
            input
        );

        this.addSectionTitle(
            topParentsSheet,
            'Top Paying Parents'
        );

        this.setColumnWidths(topParentsSheet, [
            { key: 'parent', width: 25 },
            { key: 'purchases', width: 18 },
            { key: 'spent', width: 20 },
        ]);

        this.addTableHeader(topParentsSheet, [
            'Parent',
            'Purchases',
            'Total Spent',
        ]);

        report.topPayingParents.forEach(item => {
            topParentsSheet.addRow({
                parent: item.parentName,
                purchases: item.purchases,
                spent: item.totalSpent,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return Buffer.from(buffer);
    }

    private formatDuration(seconds: number): string {

        const hours = Math.floor(seconds / 3600);

        const minutes = Math.floor((seconds % 3600) / 60);

        const remainingSeconds = seconds % 60;

        return [
            hours,
            minutes,
            remainingSeconds,
        ]
            .map(value => String(value).padStart(2, '0'))
            .join(':');
    }

    private createWorksheet( workbook: ExcelJS.Workbook, name: string ): ExcelJS.Worksheet {
        return workbook.addWorksheet(name);
    }

    private addReportHeader( sheet: ExcelJS.Worksheet, title: string, dto: ReportExportDTO, extra?: Record<string, string> ): void {

        const titleRow = sheet.addRow([title]);
        titleRow.font = {
            bold: true,
            size: 18,
        };
        titleRow.alignment = {
            horizontal: 'center',
        };
        sheet.mergeCells(
            `A${titleRow.number}:B${titleRow.number}`
        );
        sheet.addRow([
            'Date Range',
            this.getRangeText(dto),
        ]);
        if (extra) {
            Object.entries(extra).forEach(([key, value]) => {
                sheet.addRow([key, value]);
            });
        }

        sheet.addRow([
            'Generated On',
            new Date().toLocaleString(),
        ]);

        sheet.addRow([]);
    }

    private getRangeText( dto: ReportExportDTO ): string {

        if (dto.range === 'custom') {
            return `${dto.from} to ${dto.to}`;
        }

        return `This ${
            dto.range.charAt(0).toUpperCase()
            + dto.range.slice(1)
        }`;
    }

    private addSectionTitle( sheet: ExcelJS.Worksheet, title: string ): void {

        const row = sheet.addRow([title]);

        row.font = {
            bold: true,
            size: 14,
        };

        sheet.addRow([]);
    }

    private addTableHeader( sheet: ExcelJS.Worksheet, headers: string[] ): void {

        const row = sheet.addRow(headers);

        row.font = {
            bold: true,
        };
    }

    private setColumnWidths( sheet: ExcelJS.Worksheet, columns: Partial<ExcelJS.Column>[] ): void {

        sheet.columns = columns as ExcelJS.Column[];
    }

    private addBlankRows( sheet: ExcelJS.Worksheet, count = 2 ): void {

        for (let i = 0; i < count; i++) {
            sheet.addRow([]);
        }
    }

    private createReportSheet(
        workbook: ExcelJS.Workbook,
        sheetName: string,
        reportTitle: string,
        dto: ReportExportDTO,
        extra?: Record<string, string>
    ): ExcelJS.Worksheet {

        const sheet = this.createWorksheet(
            workbook,
            sheetName
        );

        this.addReportHeader(
            sheet,
            reportTitle,
            dto,
            extra
        );

        return sheet;
    }


}
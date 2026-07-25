import { PaymentMapper } from '@/Application/Mappers/Payment.mapper';
import PaymentEntity from '@/Domain/Entities/Payment.entity';
import { IPaymentRepository } from '@/Domain/RepositoryInterface/IPayment.repository';
import { IPayment, PaymentModel } from '../Database/Model/PaymentModel';
import { BaseRepository } from './Base.repository';
import { PaymentStatus } from '@/Domain/enums/PaymentStatus.enum';
import { Types } from 'mongoose';
import { ReportFilter } from '@/Domain/Types/UserReport';
import { PlanDistributionPoint, RecentTransaction, RevenueByPlanPoint, RevenueMetrics, RevenueReportData, RevenueTrendPoint, TopPayingParent } from '@/Domain/Types/RevenueReport';
import { PaymentType } from '@/Domain/enums/PaymentType.enum';
import { IParent } from '../Database/Model/ParentModel';

export class PaymentRepository
    extends BaseRepository<PaymentEntity, IPayment>
    implements IPaymentRepository {

    constructor() {
        super(PaymentModel);
    }

    async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
        const payment = await this._model.findOne({ razorpayOrderId: orderId });

        return payment ? this.mapToEntity(payment) : null;
    }

    async updateSuccess(orderId: string, paymentId: string): Promise<void> {
        await this._model.findOneAndUpdate(
            { razorpayOrderId: orderId },
            {
                status: PaymentStatus.SUCCESS,
                razorpayPaymentId: paymentId,
            }
        );
    }

    async updateFailed(orderId: string): Promise<void> {
        await this._model.findOneAndUpdate(
            { razorpayOrderId: orderId },
            {
                status: PaymentStatus.FAILED,
            }
        );
    }

    async getRevenueReport( filter: ReportFilter ): Promise<RevenueReportData> {

        const metrics = await this.getRevenueMetrics(filter);
        const revenueTrend = await this.getRevenueTrend(filter);
        const planDistribution = await this.getPlanDistribution(filter);
        const revenueByPlan = await this.getRevenueByPlan(filter);
        const recentTransactions = await this.getRecentTransactions(filter);
        const topPayingParents = await this.getTopPayingParents(filter);

        return {
            metrics,
            revenueTrend,
            planDistribution,
            revenueByPlan,
            recentTransactions,
            topPayingParents,
        };
    }



   private async getRevenueMetrics( filter: ReportFilter ): Promise<RevenueMetrics> {

        const payments = await PaymentModel.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCESS,
                    createdAt: {
                        $gte: filter.from,
                        $lte: filter.to,
                    },
                },
            },
            {
                $group: {
                    _id: null,

                    totalRevenue: {
                        $sum: "$amount",
                    },

                    totalPurchases: {
                        $sum: 1,
                    },

                    averagePurchaseValue: {
                        $avg: "$amount",
                    },
                },
            },
        ]);

        const premiumSubscribers = await PaymentModel.distinct(
            "parentId",
            {
                status: PaymentStatus.SUCCESS,
                type: PaymentType.PREMIUM,
                createdAt: {
                    $gte: filter.from,
                    $lte: filter.to,
                },
            }
        );

        const stats = payments[0];

        return {
            totalRevenue: stats?.totalRevenue ?? 0,
            totalPurchases: stats?.totalPurchases ?? 0,
            premiumSubscribers: premiumSubscribers.length,
            averagePurchaseValue: Math.round(
                stats?.averagePurchaseValue ?? 0
            ),
        };
    }

    private async getRevenueTrend( filter: ReportFilter ): Promise<RevenueTrendPoint[]> {

        const format =
            filter.range === "year"
                ? "%Y-%m"
                : "%Y-%m-%d";

        const result = await PaymentModel.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCESS,
                    createdAt: {
                        $gte: filter.from,
                        $lte: filter.to,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format,
                            date: "$createdAt",
                        },
                    },
                    revenue: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        return result.map(item => ({
            label: item._id,
            revenue: item.revenue,
        }));
    }

    private async getPlanDistribution( filter: ReportFilter ): Promise<PlanDistributionPoint[]> {

        const result = await PaymentModel.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCESS,
                    type: PaymentType.PREMIUM,
                    createdAt: {
                        $gte: filter.from,
                        $lte: filter.to,
                    },
                },
            },
            {
                $group: {
                    _id: "$plan",
                    purchases: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    purchases: -1,
                },
            },
        ]);

        return result.map(item => ({
            plan: item._id,
            purchases: item.purchases,
        }));
    }

    private async getRevenueByPlan( filter: ReportFilter ): Promise<RevenueByPlanPoint[]> {

        const result = await PaymentModel.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCESS,
                    type: PaymentType.PREMIUM,
                    createdAt: {
                        $gte: filter.from,
                        $lte: filter.to,
                    },
                },
            },
            {
                $group: {
                    _id: "$plan",
                    revenue: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    revenue: -1,
                },
            },
        ]);

        return result.map(item => ({
            plan: item._id,
            revenue: item.revenue,
        }));
    }

    private async getRecentTransactions( filter: ReportFilter ): Promise<RecentTransaction[]> {

        const result = await PaymentModel.find({
            status: PaymentStatus.SUCCESS,
            createdAt: {
                $gte: filter.from,
                $lte: filter.to,
            },
        })
        .populate<{ parentId: { _id: Types.ObjectId; name: string } }>(
            "parentId",
            "name"
        )
        .sort({ createdAt: -1 })
        .limit(10);

        return result.map(payment => ({
            parentId: payment.parentId._id.toString(),
            parentName: payment.parentId.name,
            type: payment.type,
            plan: payment.type === PaymentType.ADD_CHILD
                    ? "Add Child"
                    : payment.plan ?? "N/A",
            amount: payment.amount,
            purchasedAt: payment.createdAt,
        }));
            
    }

    private async getTopPayingParents( filter: ReportFilter ): Promise<TopPayingParent[]> {

        const result = await PaymentModel.aggregate([
            {
                $match: {
                    status: PaymentStatus.SUCCESS,
                    createdAt: {
                        $gte: filter.from,
                        $lte: filter.to,
                    },
                },
            },
            {
                $group: {
                    _id: "$parentId",
                    totalSpent: {
                        $sum: "$amount",
                    },
                    totalPayments: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    totalSpent: -1,
                },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "parents",
                    localField: "_id",
                    foreignField: "_id",
                    as: "parent",
                },
            },
            {
                $unwind: "$parent",
            },
            {
                $project: {
                    _id: 0,
                    parentId: "$parent._id",
                    parentName: "$parent.name",
                    totalSpent: 1,
                    totalPayments: 1,
                },
            },
        ]);

        return result.map(item => ({
            parentId: item.parentId.toString(),
            parentName: item.parentName,
            purchases: item.totalPayments,
            totalSpent: item.totalSpent,
        }));
    }

    protected mapToEntity(doc: IPayment): PaymentEntity {
        return PaymentMapper.toEntity(doc);
    }

    protected mapToPersistence(entity: PaymentEntity): Partial<IPayment> {
        const data = PaymentMapper.toDocument(entity);

        return {
            ...data,
             parentId: new Types.ObjectId(data.parentId),
        };
    }
}
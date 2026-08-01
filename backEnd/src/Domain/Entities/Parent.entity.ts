import BaseUser from './BaseUser.entity';
import UserRole from '../enums/UserRole.enum';
import UserStatus from '../enums/UserStatus.enum';
import BaseStatusEntity from './BaseStatus.entity';
import { IStatusEntity } from './IStatusEntity';
import { ParentUpdateData } from '../Types/ParentUpdateData';
import { SubscriptionPlan } from '../enums/SubscriptionPlan.enum';

export default class ParentEntity extends BaseUser implements IStatusEntity {

    private childrenIds : string[];
    private statusEntity: BaseStatusEntity;
    private refreshToken: string;
    private pendingChildCredits: number;
    private isPremium: boolean;
    private subscriptionPlan?: SubscriptionPlan;
    private subscriptionStartDate?: Date;
    private subscriptionExpiryDate?: Date;
    private deletedAt?: Date;
    constructor(
        name: string,
        email: string,
        password : string,
        id?: string,
        childrenIds: string[] = [],
        status: UserStatus = UserStatus.ACTIVE,
        refreshToken: string= '',
        pendingChildCredits: number = 0,
        isPremium: boolean = false,
        subscriptionPlan?: SubscriptionPlan,
        subscriptionStartDate?: Date,
        subscriptionExpiryDate?: Date,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(name, email, password, UserRole.PARENT, id ,createdAt, updatedAt) ;

        this.childrenIds = childrenIds;
        this.statusEntity = new BaseStatusEntity( status ); 
        this.refreshToken = refreshToken;
        this.pendingChildCredits = pendingChildCredits;
        this.isPremium = isPremium;
        this.subscriptionPlan = subscriptionPlan;
        this.subscriptionStartDate = subscriptionStartDate;
        this.subscriptionExpiryDate = subscriptionExpiryDate;
        this.deletedAt= deletedAt;
    }

    public getChildrenIds() : string[] {
        return this.childrenIds;
    }

    public addChild( ChildId : string ) : void {
        this.childrenIds.push( ChildId );
    }

       public block(): void {
        this.statusEntity.block();
    }

    public unblock(): void {
        this.statusEntity.unblock();
    }

    public delete(): void {
        this.statusEntity.delete();
        this.deletedAt = new Date();
    }

    public restore(): void {
        this.statusEntity.restore();
        this.deletedAt = undefined;
    }

    public getStatus(): UserStatus {
        return this.statusEntity.getStatus();
    }

    public getRefreshToken(): string {
        return this.refreshToken;
    }

    public getIsPremium(): boolean {
        return this.isPremium;
    }

    public getSubscriptionPlan(): SubscriptionPlan | undefined {
        return this.subscriptionPlan;
    }

    public getSubscriptionStartDate(): Date | undefined {
        return this.subscriptionStartDate;
    }

    public getSubscriptionExpiryDate(): Date | undefined {
        return this.subscriptionExpiryDate;
    }

    public getDeletedAt(): Date | undefined {
        return this.deletedAt;
    }
    public setDeletedAt(date?: Date): void {
        this.deletedAt = date;
    }

    public update( data:ParentUpdateData ) {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.email !== undefined) {
            this.email = data.email;
        }

        if (data.password !== undefined) {
            this.password = data.password;
        }
    }

    public activatePremium( plan: SubscriptionPlan, startDate: Date, expiryDate: Date ): void {
        this.isPremium = true;
        this.subscriptionPlan = plan;
        this.subscriptionStartDate = startDate;
        this.subscriptionExpiryDate = expiryDate;
    }

    public deactivatePremium(): void {
        this.isPremium = false;
        this.subscriptionPlan = undefined;
        this.subscriptionStartDate = undefined;
        this.subscriptionExpiryDate = undefined;
    }


    public getPendingChildCredits(): number {
        return this.pendingChildCredits;
    }

    public addChildCredit(): void {
        this.pendingChildCredits++;
    }

    public useChildCredit(): void {
        if (this.pendingChildCredits <= 0) {
            throw new Error('No child credits available');
        }

        this.pendingChildCredits--;
    }
}
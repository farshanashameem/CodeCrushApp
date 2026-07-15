import { SubscriptionPlan } from '@/Domain/enums/SubscriptionPlan.enum';
import UserRole from '@/Domain/enums/UserRole.enum';

export interface GetMeInputDTO {
    id: string;
    role: UserRole;
}

export interface SubscriptionDTO {
  isPremium: boolean;
  plan?: SubscriptionPlan;
  expiresAt?: Date;
  daysRemaining?: number;
}

export interface GetMeOutputDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;

    subscription?: SubscriptionDTO;
}
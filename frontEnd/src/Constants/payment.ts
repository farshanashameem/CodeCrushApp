export const SubscriptionPlan= {
  MONTHLY : "MONTHLY",
  SIX_MONTHS : "SIX_MONTHS",
  YEARLY : "YEARLY",
}

export const PaymentType = {
  ADD_CHILD: "ADD_CHILD",
  PREMIUM: "PREMIUM",
}


export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];
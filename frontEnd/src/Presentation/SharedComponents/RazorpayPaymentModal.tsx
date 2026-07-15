import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { createPaymentOrder, verifyPayment } from "../../redux/Slices/paymentSlice";
import type { AppDispatch } from "../../redux/store";

import { PaymentType } from "../../Constants/payment";
import { SubscriptionPlan } from "../../Constants/payment";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  open: boolean;
  type: string;
  plan?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RazorpayPaymentModal = ({
  open,
  type,
  plan,
  onClose,
  onSuccess,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(  plan || SubscriptionPlan.MONTHLY );

  if (!open) return null;

  const handlePayment = async () => {
    try {
      setLoading(true);


      const order = await dispatch(
        createPaymentOrder({
          type,
          plan: type === PaymentType.PREMIUM
                ? selectedPlan
                : undefined,
        })
      ).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Code Crush",

        description:
          type === PaymentType.ADD_CHILD
            ? "Add New Child"
            : "Premium Subscription",

        order_id: order.orderId,

        handler: async (response: any) => {
          try {
            await dispatch(
              verifyPayment({
                orderId: order.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              })
            ).unwrap();

            toast.success("Payment Successful");

            onSuccess();

            onClose();
          } catch (err: any) {
            toast.error(err.message || "Verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err: any) {
      toast.error(err.message || "Unable to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl w-[420px] p-8">

        <h2 className="text-2xl font-bold text-center mb-4">
          {type === PaymentType.ADD_CHILD
            ? "Add Child"
            : "Premium Subscription"}
        </h2>

        <div className="text-center">

          {type === PaymentType.ADD_CHILD ? (
            <>
              <p className="text-gray-600">
                Adding another child requires a one-time payment.
              </p>

              <h1 className="text-4xl font-bold text-green-600 mt-4">
                ₹50
              </h1>
            </>
          ) : (
            <>
                <p className="text-gray-600 mb-6">
                    Choose a subscription plan
                </p>

                <div className="space-y-3">

                    <button
                    onClick={() => setSelectedPlan(SubscriptionPlan.MONTHLY)}
                    className={`w-full rounded-xl border p-4 text-left ${
                        selectedPlan === SubscriptionPlan.MONTHLY
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                    >
                    <div className="flex justify-between">
                        <span className="font-semibold">Monthly</span>
                        <span>No Discount</span>
                    </div>

                    <p className="text-sm text-gray-500">
                        ₹100 × Number of Children
                    </p>
                    </button>

                    <button
                    onClick={() => setSelectedPlan(SubscriptionPlan.SIX_MONTHS)}
                    className={`w-full rounded-xl border p-4 text-left ${
                        selectedPlan === SubscriptionPlan.SIX_MONTHS
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                    >
                    <div className="flex justify-between">
                        <span className="font-semibold">
                        6 Months
                        </span>

                        <span className="text-green-600 font-bold">
                        Save 10%
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Billed every 6 months
                    </p>
                    </button>

                    <button
                    onClick={() => setSelectedPlan(SubscriptionPlan.YEARLY)}
                    className={`w-full rounded-xl border p-4 text-left ${
                        selectedPlan === SubscriptionPlan.YEARLY
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                    >
                    <div className="flex justify-between">
                        <span className="font-semibold">
                        Yearly
                        </span>

                        <span className="text-green-600 font-bold">
                        Save 20%
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Best Value
                    </p>
                    </button>

                </div>

                <div className="mt-6 rounded-xl bg-yellow-50 border border-yellow-300 p-4">

                    <p className="font-semibold">
                    Pricing
                    </p>

                    <p className="text-sm mt-2">
                    ₹100 per child / month
                    </p>

                    <p className="text-sm">
                    3 or more children get ₹50 OFF every month.
                    </p>

                    <p className="text-xs text-gray-500 mt-3">
                    Final amount will be calculated automatically.
                    </p>

                </div>
            </>
          )}

        </div>

        <div className="flex gap-3 mt-8">

          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handlePayment}
            className="flex-1 bg-green-600 text-white rounded-xl py-3"
          >
            {loading ? "Please Wait..." : "Pay Now"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default RazorpayPaymentModal;
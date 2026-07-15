import type { CreateOrderPayload, CreateOrderResponse, PaymentState, VerifyPaymentPayload } from "../../Types/payment";
import { API_ROUTES } from "../../Constants/api.routes";
import api from "../../Lib/axios";
import type { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: PaymentState = {
  loading: false,
  error: null,
  order: null,
};

export const createPaymentOrder = createAsyncThunk< CreateOrderResponse, CreateOrderPayload, { rejectValue: string } >(
  "payment/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.PARENT.PAYMENT.CREATE,
        data
      );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to create payment"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk< void, VerifyPaymentPayload, { rejectValue: string } >(
  "payment/verify",
  async (data, { rejectWithValue }) => {
    try {
      await api.post(
        API_ROUTES.PARENT.PAYMENT.VERIFY,
        data
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Payment verification failed"
      );
    }
  }
);


const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })

      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed";
      })

      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })

      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Verification failed";
      });
  },
});

export default paymentSlice.reducer;
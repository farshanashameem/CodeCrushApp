import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserRole } from "../../Constants/Role";
import type {
  AuthState,
  LoginPayload,
  User,
  RegisterPayload,
  ResetPasswordPayload,
  
} from "../../Types/user";
import api from "../../Lib/axios";
import type { AxiosError } from "axios";
import type { AdminLoginPayload } from "../../Types/admin";
import { API_ROUTES } from "../../Constants/api.routes";
import type {  UpdateProfilePayload } from "../../Types/parent";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  role: null,
  isAuthenticated: false,
   authChecked: false,
};


// ================= REGISTER =================
export const registerUser = createAsyncThunk< { email: string; role: UserRole }, RegisterPayload, { rejectValue: string } >(
  "auth/register",
  async ({ role, data }, { rejectWithValue }) => {
    try {
      const response = await api.post( API_ROUTES.AUTH.REGISTER(role), data );

      if (!response.data.success) {
        return rejectWithValue("Registration failed");
      }

      return {
        email: data.email,
        role,
      };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);


// ================= LOGIN =================
export const loginUser = createAsyncThunk< { user: User; role: UserRole }, LoginPayload, { rejectValue: string } >(
  "auth/login",
  async ({ role, data }, { rejectWithValue }) => {
    try {
      const response = await api.post( API_ROUTES.AUTH.LOGIN(role), data );
      const user = response.data.data 

      if (!user) {
        return rejectWithValue("Invalid login credentials");
      }

      return { user, role };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

  return rejectWithValue(
    err.response?.data?.message ||
    "Failed to login"
  );
    }
  }
);


// ================= ADMIN LOGIN =================
export const adminLogin = createAsyncThunk< { admin: User }, AdminLoginPayload, { rejectValue: string } >(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post( API_ROUTES.ADMIN.LOGIN, { email, password } );
      
      const admin = response.data.data;

      if (!admin) {
        return rejectWithValue("Invalid response");
      }

      return { admin };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Admin login failed"
      );
    }
  }
);


// ================= LOGOUT =================
export const logoutUser = createAsyncThunk< void, void, { rejectValue: string } >(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Logout failed"
      );
    }
  }
);


// ================= GET ME =================
export const getMe = createAsyncThunk< { user: User },  void, { rejectValue: string } >(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.AUTH.ME );

      const user = response.data.data;

      if (!user) {
        return rejectWithValue(
          "Invalid session response"
        );
      }

      return { user };

    } catch (error) {
      const err =
        error as AxiosError<{message:string}>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Get me failed"
      );
    }
  }
);

type VerifyOtpResult =
  | {
      type: "REGISTRATION";
      user: User;
      role: UserRole;
    }
  | {
      type: "FORGOT_PASSWORD";
      resetToken: string;
      role: UserRole;
    };


// ================= VERIFY OTP =================
export const verifyOtp = createAsyncThunk<
  VerifyOtpResult,  {
    role: UserRole;
    email: string;
    otp: string;
    type: "REGISTRATION" | "FORGOT_PASSWORD";
  }, { rejectValue: string } >(
  "auth/verify-otp",
  async ({ role, otp, email, type }, { rejectWithValue }) => {
    try {
      const response = await api.post(  API_ROUTES.AUTH.VERIFY_OTP(role),  { email, otp, type }  );

      const data = response.data.data;

      // Safe fallback assignment for nested or direct structures
      const user = data.user || data.parent || data.data?.user || data.data?.parent || data;
      const resetToken = data.resetToken || data.data?.resetToken;

      if (type === "REGISTRATION") {
        // Fallback option in case registration simply updates database status with status: 200
        return {
          type: "REGISTRATION",
          role,
          user: user || { email } as User, 
        };
      }

      if (type === "FORGOT_PASSWORD") {
        if (!resetToken) {
          return rejectWithValue("Reset token missing from backend response");
        }

        return {
          type: "FORGOT_PASSWORD",
          role,
          resetToken,
        };
      }

      return rejectWithValue("Invalid OTP type specified");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

// ================= RESEND OTP =================
export const resendOtp = createAsyncThunk<
  { role: UserRole; email: string },
  {
    role: UserRole;
    email: string;
    type: "REGISTRATION" | "FORGOT_PASSWORD";
  }, { rejectValue: string } >(
  "auth/resend-otp",
  async (
    { role, email, type },
    { rejectWithValue }
  ) => {
    try {

      const response = await api.post(  API_ROUTES.AUTH.RESEND_OTP(role),  { email, type  } );

      if (!response.data.success) {
        return rejectWithValue(
          "Invalid response"
        );
      }

      return {
        email,
        role
      };

    } catch (error) {

      const err =
        error as AxiosError<{
          message:string
        }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to resend OTP"
      );
    }
  }
);


// ================= FORGOT PASSWORD =================
export const forgotPassword = createAsyncThunk< { role: UserRole; email: string },  { role: UserRole; email: string }, { rejectValue: string } >(
  "auth/forgot-password",
  async ({ role, email }, { rejectWithValue }) => {
    try {
      const response = await api.post(  API_ROUTES.AUTH.FORGOT_PASSWORD(role), { email } );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return { email, role };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          "Forgot password failed"
      );
    }
  }
);


export const resetPassword = createAsyncThunk<  void, ResetPasswordPayload, { rejectValue: string } >(
  "auth/reset-password",
  async (
    { role, email, token, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.RESET_PASSWORD(role),
        {
          email,
          token,   
          newPassword,
          confirmPassword,
        } );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Reset password failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk< User, UpdateProfilePayload, { rejectValue: string }>(
  "/parent/profile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ROUTES.PARENT.PROFILE,
        data
      );

      if (!response.data.success) {
        return rejectWithValue("Profile update failed");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Profile update failed"
      );
    }
  }
);


// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Login failed";
      })

      // ADMIN LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.admin;
        state.role = "admin";
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Admin login failed";
      })

      // GET ME
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.error =
          action.payload || "Session expired";
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Logout failed";
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;

        if (action.payload.type === "REGISTRATION") {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }

        if (action.payload.type === "FORGOT_PASSWORD") {
          state.isAuthenticated = false; // important
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "OTP verification failed";
      })

      // RESEND OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Resend OTP failed";
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Forgot password failed";
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Reset password failed";
      });

      // UPDATE PROFILE
      builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile update failed";
      });
      },
    });

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
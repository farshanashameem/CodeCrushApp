import Express  from "express";
import { parentAuthController } from "@/Presentation/Factory/ParentFactory";
import { ROUTES } from "@/Shared/Routes";
import { loginSchema } from "@/Presentation/Validators/LoginValidator";
import { validate } from "@/Presentation/Middlewares/Validate";
import { forgotPasswordSchema, otpSchema, registerSchema, resendOtpSchema, resetPasswordSchema } from "@/Presentation/Validators/RegisterValidator";
const router = Express.Router();

router.post(ROUTES.PARENT.LOGIN,validate(loginSchema, 'body'), parentAuthController.login);
router.post(ROUTES.PARENT.REGISTER,validate(registerSchema, 'body'), parentAuthController.register);
router.post(ROUTES.PARENT.VERIFY_OTP, validate(otpSchema, 'body' ), parentAuthController.VerifyOTP);
router.post(ROUTES.PARENT.RESEND_OTP, validate(resendOtpSchema, 'body'), parentAuthController.ResendOTP);
router.post(ROUTES.PARENT.FORGOT_PASSWORD, validate( forgotPasswordSchema, 'body'), parentAuthController.forgotPassword);
router.post(ROUTES.PARENT.RESET_PASSWORD, validate( resetPasswordSchema, 'body'), parentAuthController.resetPassword);

export default router;
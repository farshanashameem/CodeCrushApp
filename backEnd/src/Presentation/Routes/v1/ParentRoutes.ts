import Express  from 'express';
import { parentAuthController } from '@/Presentation/Factory/ParentFactory';
import { ROUTES } from '@/Shared/Routes';
import { loginSchema } from '@/Presentation/Validators/LoginValidator';
import { validate } from '@/Presentation/Middlewares/Validate';
import { authParentHandler } from '@/Presentation/Middlewares/parentAuthMiddleware';
import { tokenService } from '@/Presentation/Factory/ParentFactory';
import { forgotPasswordSchema, otpSchema, registerSchema, resendOtpSchema, resetPasswordSchema, UpdateProfileSchema } from '@/Presentation/Validators/RegisterValidator';
import { childManagementcontroller } from '@/Presentation/Factory/ParentFactory';
const router = Express.Router();

router.post(ROUTES.PARENT.LOGIN,validate(loginSchema, 'body'), parentAuthController.login);
router.post(ROUTES.PARENT.REGISTER,validate(registerSchema, 'body'), parentAuthController.register);
router.post(ROUTES.PARENT.VERIFY_OTP, validate(otpSchema, 'body' ), parentAuthController.VerifyOTP);
router.post(ROUTES.PARENT.RESEND_OTP, validate(resendOtpSchema, 'body'), parentAuthController.ResendOTP);
router.post(ROUTES.PARENT.FORGOT_PASSWORD, validate( forgotPasswordSchema, 'body'), parentAuthController.forgotPassword);
router.post(ROUTES.PARENT.RESET_PASSWORD, validate( resetPasswordSchema, 'body'), parentAuthController.resetPassword);


router.use( authParentHandler(tokenService));
router.put(ROUTES.PARENT.PROFILE, validate(UpdateProfileSchema, 'body'), parentAuthController.updateProfile);

router.get( ROUTES.PARENT.CHILD_MANAGEMENT.CHILDREN.BASE,childManagementcontroller.getAllChildren);
router.get( ROUTES.PARENT.CHILD_MANAGEMENT.CHILDREN.BY_ID, childManagementcontroller.getChildDetails);
router.post( ROUTES.PARENT.CHILD_MANAGEMENT.CHILDREN.BASE, childManagementcontroller.addChild );
router.put( ROUTES.PARENT.CHILD_MANAGEMENT.CHILDREN.BY_ID, childManagementcontroller.updateChild );
router.patch( ROUTES.PARENT.CHILD_MANAGEMENT.CHILDREN.STATUS, childManagementcontroller.toggleChildStatus );


export default router;
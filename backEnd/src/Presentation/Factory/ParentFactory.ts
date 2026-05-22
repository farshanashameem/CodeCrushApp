//Controllers
import { ParentAuthController } from "../Controllers/Parent/AuthController";


//use case
import { RegisterParentUseCase } from "@/Application/Parent/useCases/RegisterParent.usecase";
import { ForgotPasswordUseCase } from "@/Application/Parent/useCases/ForgotPassword.candidate.useCase";
import { ResendOTPUsecase } from "@/Application/Parent/useCases/ResendOTPUseCase";
import { ResetPasswordUseCase } from "@/Application/Parent/useCases/ResetPassword.usecase";
import { ParentLoginUseCase } from "@/Application/Parent/useCases/ParentLoginUseCase";
import { VerifyOTPUseCase } from "@/Application/Parent/useCases/VerifyOTPUseCase";
import { SendOTPUseCase } from "@/Application/Parent/useCases/SendOTP.usecase";

//repositories
import { ParentRepository } from "@/Infrastructure/Repositories/Parent.repository";

//Services
import { HashService } from "@/Infrastructure/Services/HashService";
import { OTPService } from "@/Infrastructure/Services/OTPService";
import { TokenService } from "@/Infrastructure/Services/TokenService";
import { MailService } from "@/Infrastructure/Services/MailService";
import { OTPRepository } from "@/Infrastructure/Repositories/OTP.repository";


const parentRepository = new ParentRepository();
const otpRepository = new OTPRepository();


const hashService = new HashService();
const otpService = new OTPService();
export const tokenService = new TokenService();
const mailService = new MailService();

const sendOtpUseCase = new SendOTPUseCase(
    otpRepository,
    otpService,
    hashService,
    mailService
);

const registerParentUseCase = new RegisterParentUseCase(
    parentRepository,
    hashService,
    sendOtpUseCase
)

const resendOtpUseCase = new ResendOTPUsecase(
    otpRepository,
    parentRepository,
    otpService,
    hashService,
    mailService
);


const loginParentUseCase = new ParentLoginUseCase(
    parentRepository,
    hashService,
    tokenService
);

const forgotPasswordUseCase = new ForgotPasswordUseCase(
    parentRepository,
    sendOtpUseCase  
)

const verifyOtpUseCase = new VerifyOTPUseCase(
    otpService,
    otpRepository,
    parentRepository,
    tokenService
);

const resetPasswordUseCase = new ResetPasswordUseCase(
    parentRepository,
    hashService,
    tokenService
);


//Controllers
export const parentAuthController = new ParentAuthController(
    registerParentUseCase,
    verifyOtpUseCase,
    resendOtpUseCase,
    loginParentUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase
);
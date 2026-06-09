//Controllers
import { ParentAuthController } from '../Controllers/Parent/auth.controller';
import { ChildManagementController } from '../Controllers/Parent/child_management.controller';


//use case
import { RegisterParentUseCase } from '@/Application/Parent/useCases/RegisterParent.usecase';
import { ForgotPasswordUseCase } from '@/Application/Parent/useCases/ForgotPassword.candidate.useCase';
import { ResendOTPUsecase } from '@/Application/Parent/useCases/ResendOTP.useCase';
import { ResetPasswordUseCase } from '@/Application/Parent/useCases/ResetPassword.usecase';
import { ParentLoginUseCase } from '@/Application/Parent/useCases/ParentLogin.useCase';
import { VerifyOTPUseCase } from '@/Application/Parent/useCases/VerifyOTP.useCase';
import { SendOTPUseCase } from '@/Application/Parent/useCases/SendOTP.usecase';
import { AddChildUseCase } from '@/Application/Parent/useCases/ChildManagement/AddChild.useCase';
import { UpdateChildUseCase } from '@/Application/Parent/useCases/ChildManagement/UpdateChild.useCase';
import { ParentToggleUserStatus } from '@/Application/Parent/useCases/ChildManagement/ToggleUserStatus.usecase';
import { GetAllChildrenUseCase } from '@/Application/Parent/useCases/ChildManagement/getAllChildren.usecase';
import { ParentGetChildUseCase } from '@/Application/Parent/useCases/ChildManagement/getChild.usecase';
import { UpdateProfileUseCase } from '@/Application/Parent/useCases/UpdateProfile.usecase.dto';

//repositories
import { ParentRepository } from '@/Infrastructure/Repositories/Parent.repository';
import { ChildRepository } from '@/Infrastructure/Repositories/Child.repository';

//Services
import { HashService } from '@/Infrastructure/Services/HashService';
import { OTPService } from '@/Infrastructure/Services/OTPService';
import { TokenService } from '@/Infrastructure/Services/TokenService';
import { MailService } from '@/Infrastructure/Services/MailService';
import { OTPRepository } from '@/Infrastructure/Repositories/OTP.repository';
import { ToggleUserStatusUseCase } from '@/Application/Common/useCases/ToggleUserStatus.useCase';


const parentRepository = new ParentRepository();
const otpRepository = new OTPRepository();
const childRepository = new ChildRepository(); 


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
);

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
);

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

const addChildUseCase = new AddChildUseCase(
    childRepository, parentRepository
);

const updateChildUseCase = new UpdateChildUseCase(
    childRepository
);

const getAllChildrenUseCase = new GetAllChildrenUseCase(
    childRepository
);

const getChildUseCase = new ParentGetChildUseCase(
    childRepository,
    parentRepository
);

const toggleChildStatusUseCase = new ParentToggleUserStatus(
    childRepository
);

const updateProfileUseCase = new UpdateProfileUseCase(
    parentRepository, 
    hashService
)



//Controllers
export const parentAuthController = new ParentAuthController(
    registerParentUseCase,
    verifyOtpUseCase,
    resendOtpUseCase,
    loginParentUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    updateProfileUseCase
);

export const childManagementcontroller = new ChildManagementController(
    getAllChildrenUseCase,
    addChildUseCase,
    getChildUseCase,
    updateChildUseCase,
    toggleChildStatusUseCase
);


import { IParentRepository } from "@/Domain/RepositoryInterface/IParent.repository";
import { IParentRegisterUseCase } from "../Interfaces/IParentRegisterUseCase";
import { IHashService } from "@/Application/Interfaces/Services/IHashService";
import { IOTPService } from "@/Application/Interfaces/Services/IOTPService";
import { IEmailService } from "@/Application/Interfaces/Services/IEmailService";
import { RegisterParentInputDTO, RegisterParentOutputDTO } from "../dto/register.parent.dto";
import { AppError } from "@/Domain/Errors/app.error";
import { authMessages } from "@/Shared/Messages/AuthMessages";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { OTPEntity } from "@/Domain/Entities/OTP.entity";
import OTPType from "@/Domain/enums/OTPType.enum";
import { IOTPRepository } from "@/Domain/RepositoryInterface/IOTP.repository";
import { ISendOTPUseCase } from "../Interfaces/ISendOTPUseCase";

 export class RegisterParentUseCase implements IParentRegisterUseCase {
    constructor(
        private _parentRepository: IParentRepository,
        private _hashService: IHashService,
        private _sendOTPUseCase: ISendOTPUseCase
    ) {}

    async execute(input: RegisterParentInputDTO): Promise<void> {
        
        const existUser = await this._parentRepository.findByEmail(input.email);

        if(existUser) {
            throw new AppError ( authMessages.error.PARENT_ALREADY_EXISTS, StatusCodes.CONFLICT);
        }

        const hashedPassword = await this._hashService.hash(input.password);

        await this._sendOTPUseCase.execute({
            email: input.email,
            type: OTPType.REGISTRATION,
            name: input.name,
            password: hashedPassword
        })
    }
 }
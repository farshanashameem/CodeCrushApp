import { GetCurrentChildSessionOutputDTO } from '../dto/GetCurrentChildSession.dto';

export interface IGetCurrentChildSessionUseCase {
  execute(sessionId: string): Promise<GetCurrentChildSessionOutputDTO>;
}
import ChildSessionEntity from '../Entities/ChildSession.entity';
import { IBaseRepository } from './IBase.repository';

export interface IChildSessionRepository extends IBaseRepository<ChildSessionEntity> {
  
  findByToken(token: string): Promise<ChildSessionEntity | null>;
  findActiveSessionByChildId( childId: string, ): Promise<ChildSessionEntity | null>;
  deactivate(sessionId: string): Promise<void>;
  updateLastActivity( sessionId: string,lastActivity: Date) : Promise<void>
}

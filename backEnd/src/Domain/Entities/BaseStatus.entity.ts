import UserStatus from '../enums/UserStatus.enum';
import { DomainError } from '../Errors/DomainError';

export default  class BaseStatusEntity {
    protected status: UserStatus;

    constructor(status: UserStatus = UserStatus.ACTIVE) {
        this.status = status;
    }

    public getStatus(): UserStatus {
        return this.status;
    }

    public block(): void {
        if (this.status === UserStatus.BLOCKED) {
            throw new DomainError('User already blocked');
        }

        if (this.status === UserStatus.DELETED) {
            throw new DomainError('Cannot block deleted user');
        }

        this.status = UserStatus.BLOCKED;
    }

    public unblock(): void {
        if (this.status !== UserStatus.BLOCKED) {
            throw new DomainError('User is not blocked');
        }

        this.status = UserStatus.ACTIVE;
    }

    public delete(): void {
        if (this.status === UserStatus.DELETED) {
            throw new DomainError('User already deleted');
        }

        this.status = UserStatus.DELETED;
    }

    public restore(): void {
        if (this.status !== UserStatus.DELETED) {
            throw new DomainError('Only deleted users can be restored');
        }

        this.status = UserStatus.ACTIVE;
    }
}
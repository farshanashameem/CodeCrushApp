import UserStatus from "../enums/UserStatus.enum";

export interface IStatusEntity {
    getId(): string | undefined;

    block(): void;
    unblock(): void;
    delete(): void;
    restore(): void;

    getStatus(): UserStatus;
}
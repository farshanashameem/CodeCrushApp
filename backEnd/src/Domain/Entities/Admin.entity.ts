import UserRole from "../enums/UserRole.enum";
import BaseUser from "./BaseUser.entity";

export default class AdminEntity extends BaseUser {
    private refreshToken: string;
    constructor (
        name: string,
        email: string,
        password: string,
        id: string,
        refreshToken: string= "",
        createdAt: Date, 
        updatedAt : Date
    ) {

        super ( name, email, password,UserRole.ADMIN, id, createdAt, updatedAt);
        this.refreshToken = refreshToken;
    }

    public getRefreshToken() : string {
        return this.refreshToken;
    }
}
import UserRole from '../enums/UserRole.enum';

export default class BaseUser {
    protected id?: string;
    protected name : string;
    protected email : string;
    protected password : string;
    protected role: UserRole;
    private createdAt?: Date;
    private updatedAt? : Date;

    protected constructor(
        name: string,
        email: string,
        password : string,
        role : UserRole,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date

    ) {
        this.id = id;
        this.name= name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }


    public getId() : string | undefined {
        return this.id;
    }

    public getName() : string {
        return this.name;
    }

    public getEmail() : string {
        return this.email;
    }

    public getRole() : UserRole {
        return this.role;
    }

    public getPassword() : string {
        return this.password;
    }

    
    
    
}
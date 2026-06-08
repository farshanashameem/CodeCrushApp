import BaseUser from './BaseUser.entity';
import UserRole from '../enums/UserRole.enum';
import UserStatus from '../enums/UserStatus.enum';
import BaseStatusEntity from './BaseStatus.entity';
import { IStatusEntity } from './IStatusEntity';

export default class ParentEntity extends BaseUser implements IStatusEntity {

    private childrenIds : string[];
    private statusEntity: BaseStatusEntity;
    private refreshToken: string;
    constructor(
        name: string,
        email: string,
        password : string,
        id?: string,
        childrenIds: string[] = [],
        status: UserStatus = UserStatus.ACTIVE,
        refreshToken: string= '',
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(name, email, password, UserRole.PARENT, id ,createdAt, updatedAt) ;

        this.childrenIds = childrenIds;
        this.statusEntity = new BaseStatusEntity( status ); 
        this.refreshToken = refreshToken;
    }

    public getChildrenIds() : string[] {
        return this.childrenIds;
    }

    public addChild( ChildId : string ) : void {
        this.childrenIds.push( ChildId );
    }

       public block(): void {
        this.statusEntity.block();
    }

    public unblock(): void {
        this.statusEntity.unblock();
    }

    public delete(): void {
        this.statusEntity.delete();
    }

    public restore(): void {
        this.statusEntity.restore();
    }

    public getStatus(): UserStatus {
        return this.statusEntity.getStatus();
    }

    public getRefreshToken(): string {
        return this.refreshToken;
    }
}
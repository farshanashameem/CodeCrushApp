
export interface CreateChildDTO {
    parentId: string;
    name: string;
    age: number;
    avatar: string;
    dob?: Date;
}

export interface UpdateChildDTO {

    childId: string;
    name?: string;
    age?: number;
    avatar?: string;
    dob?: Date;
}
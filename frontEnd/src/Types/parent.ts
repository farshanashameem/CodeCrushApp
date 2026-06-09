export interface ParentPayload {
    id: string;
    name: string;
    email: string;
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface Parent {
  _id: string;
  name: string;
  email: string;
}
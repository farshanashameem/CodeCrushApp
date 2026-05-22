export interface ParentPayload {
    id: string;
    name: string;
    email: string;
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
}
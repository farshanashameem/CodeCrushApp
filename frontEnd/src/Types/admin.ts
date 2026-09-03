export interface AdminLoginPayload {
    email: string;
    password: string;
}

export interface DashboardStats {
    totalParents: number;
    totalChildren: number;
    totalGames: number;
    totalLevels: number;
}
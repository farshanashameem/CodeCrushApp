export const ROLES = {
    ADMIN: "admin",
    PARENT: "parent",
    CHILD: "child"
}

export type UserRole = typeof ROLES[ keyof typeof ROLES];
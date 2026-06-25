export default class IconEntity {
    constructor(
        private name: string,
        private iconKey: string,
        private color: string,
        private category?: string,
        private id?: string,
        private isActive: boolean = true,
        private createdAt: Date = new Date(),
        private updatedAt?: Date,
    ) {}

    public getId(): string | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getIconKey(): string {
        return this.iconKey;
    }

    public getColor(): string {
        return this.color;
    }

    public getCategory(): string | undefined {
        return this.category;
    }

    public isIconActive(): boolean {
        return this.isActive;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}
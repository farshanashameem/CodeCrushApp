export default class ImageEntity {
    constructor(
        private name: string,
        private imageUrl: string,
        private publicId: string,
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

    public getImageUrl(): string {
        return this.imageUrl;
    }

      public getPublicId(): string {
        return this.publicId;
    }

    public getCategory(): string | undefined {
        return this.category;
    }

    public isImageActive(): boolean {
        return this.isActive;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}
export interface GetAllImagesOutputDTO {
    images: {
        id: string;
        name: string;
        imageUrl: string;
        publicId: string;
        category?: string;
        isActive: boolean;
    }[];
}
export interface GetImageInputDTO {
    imageId: string;
}

export interface GetImageOutputDTO {
    id: string;
    name: string;
    imageUrl: string;
    publicId: string;
    category?: string;
    isActive: boolean;
}
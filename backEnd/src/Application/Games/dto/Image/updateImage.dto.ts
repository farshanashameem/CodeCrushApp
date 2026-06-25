export interface UpdateImageInputDTO {
    imageId: string;
    name?: string;
    imageUrl?: string;
    publicId?: string;
    category?: string;
    isActive?: boolean;
}

export interface UpdateImageOutputDTO {
    success: boolean;
    message: string;
}
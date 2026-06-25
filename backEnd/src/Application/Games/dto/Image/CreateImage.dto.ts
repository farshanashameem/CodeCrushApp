// createImage.dto.ts

export interface CreateImageInputDTO {
    name: string;
    imageUrl: string;
    publicId: string;
    category?: string;
}

export interface CreateImageOutputDTO {
    image: {
        id: string;
        name: string;
        imageUrl: string;
        publicId: string;
        category?: string;
        isActive: boolean;
    };
}
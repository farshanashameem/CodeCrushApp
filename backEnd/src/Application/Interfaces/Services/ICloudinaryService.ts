export interface UploadImageResponse {
    publicId: string;
    secureUrl: string;
}

export interface ICloudinaryService {
    uploadImage(
        fileBuffer: Buffer,
        folder?: string
    ): Promise<UploadImageResponse>;

    deleteImage(
        publicId: string
    ): Promise<void>;
}
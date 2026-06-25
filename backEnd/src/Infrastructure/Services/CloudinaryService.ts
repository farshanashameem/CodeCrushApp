import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryService, UploadImageResponse } from "@/Application/Interfaces/Services/ICloudinaryService";
import { env } from "../Config/env";
import streamifier from "streamifier";

export class CloudinaryService implements ICloudinaryService {

    constructor() {
        cloudinary.config({
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
        });
        
    }
  
    async uploadImage(
    fileBuffer: Buffer,
    folder = "picture-puzzlers"
  ): Promise<UploadImageResponse> {

    return new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
        },

        (error, result) => {

          if (error || !result) {
            return reject(error);
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        }
      );

      streamifier
        .createReadStream(fileBuffer)
        .pipe(stream);
    });
  }

    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}
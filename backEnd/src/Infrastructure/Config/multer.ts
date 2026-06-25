import multer from "multer";
import path from "path";

import { AppError } from "@/Domain/Errors/app.error";
import StatusCodes from "@/Domain/enums/StatusCodes.enum";
import { authMessages } from "@/Shared/Messages/AuthMessages";

const storage = multer.memoryStorage();

   

const fileFilter: multer.Options["fileFilter"] = ( req, file, cb ) => {

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    const isValidMimeType =
        allowedMimeTypes.includes(file.mimetype);

    const isValidExtension =
        allowedExtensions.includes(extension);

    if (isValidMimeType && isValidExtension) {
        return cb(null, true);
    }

    return cb(
        new AppError(
            authMessages.error.ONLY_IMAGE_FILES_ARE_ALLOWED,
            StatusCodes.BAD_REQUEST
        )
    );
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});
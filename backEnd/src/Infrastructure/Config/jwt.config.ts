import { access } from "node:fs";
import { env } from "./env";

export const jwtConfig = {
    accessToken: {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_TOKEN_MAX_AGE
    },
    refreshToken: {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_TOKEN_MAX_AGE
    },

     resetToken: {
        secret: env.JWT_RESET_SECRET,
        expiresIn: env.JWT_RESET_TOKEN_MAX_AGE
    }

}
import { ApiResponse } from '@/types/response';
import { Response } from 'express';


export const sendSuccess = <T> (
    res: Response,
    statusCode: number,
    message: string,
    data?: T
) => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        ...(data !== undefined && {data})
    };

    return res.status(statusCode).json(response);
};
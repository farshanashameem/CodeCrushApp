import { Request, Response, NextFunction } from 'express';
import z from 'zod';

type RequestProperty = 'body' | 'query' | 'params';

export const validate = <T extends z.ZodTypeAny>( schema:T, property: RequestProperty) => (
    req: Request, res: Response, next: NextFunction
): asserts req is Request & {
    [K in typeof property ] : z.infer<T>;
} => {
    const parsed = schema.parse(req[property]);
    if( property === 'query') {
        req.validatedQuery = parsed;
    }else if( property === 'params') {
        req.validateParams = parsed;
    } else {
        req[property] = parsed;
    }
    next();
};
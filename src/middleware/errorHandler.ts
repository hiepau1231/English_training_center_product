import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    // Log error for debugging
    console.error('Error:', err);

    // Default error response
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}; 
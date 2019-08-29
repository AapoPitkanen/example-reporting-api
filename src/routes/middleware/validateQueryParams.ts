import { Request, Response, NextFunction } from "express";

export const validateQueryParams = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const field of fields) {
            if (!req.query[field]) {
                return res
                    .status(400)
                    .send(
                        `Please input all required fields, field ${field} is missing from the request.`
                    );
            }
        }
        next();
    };
};

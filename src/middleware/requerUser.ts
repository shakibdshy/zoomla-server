import { NextFunction, Request, Response } from "express";

const requiredUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) { 
        return res.status(403)
    }

    return next();
}

export default requiredUser;
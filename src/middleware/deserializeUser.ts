import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

const deserializeUser = (req: Response, res: Request, next: NextFunction) => {
    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");

    if (!accessToken) {
        return next()
    }

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
        res.locals.user = decoded;
    }

    return next()
}
 
export default deserializeUser;
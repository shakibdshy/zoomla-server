import { Request, Response } from "express";
import log from "../utils/logger";

const createUserHandler = async (req: Request, res: Response) => {
    try {
        // const user = await createUser(req.body)
    } catch (error: any) {
        log.error(error)
        res.status(409).send(error.message)
    }
}

export default createUserHandler
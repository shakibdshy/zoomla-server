import { CreateUserInput } from './../schema/userSchema';
import { Request, Response } from "express";
import log from "../utils/logger";

const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    try {
        // const user = await createUser(req.body)
        const body = req.body;
    } catch (error: any) {
        log.error(error)
        res.status(409).send(error.message)
    }
}

export default createUserHandler
import { CreateUserInput } from '../schema/userSchema';
import { Request, Response } from "express";
import log from "../utils/logger";
import { createUser } from '../service/user.service';
import sendEmail from '../utils/mailer';

const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    const body = req.body;
    try {
        const user = await createUser(body)
        await sendEmail({
            to: user.email,
            from: "test@example.com",
            subject: "Verify your email",
            text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
        });
        return res.send('User Successfully Created')
    } catch (error: any) {
        if (error.code === 11000) { 
            return res.status(409).send('User Already Exists')
        }

        log.error(error)
        return res.status(500).send(error)
    }
}

export default createUserHandler
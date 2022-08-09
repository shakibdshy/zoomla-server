import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/userSchema';
import { Request, Response } from "express";
import log from "../utils/logger";
import { createUser, findUserByEmail, findUserById } from '../service/user.service';
import sendEmail from '../utils/mailer';
import { nanoid } from 'nanoid';

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

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const id = req.params.id
    const verificationCode = req.params.verificationCode

    // Find user by id and verify code
    const user = await findUserById(id)

    if (!user) {
        return res.send('Could not Verify User')
    }

    // Check to see if they are verified
    if (user.verified) {
        return res.send('User Already Verified')
    }

    // If not, update them to verified
    if (user.verificationCode === verificationCode) {
        user.verified = true
        await user.save()
        return res.send('User Successfully  Verified')
    }

    return res.send('Could not Verify User')
}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    const message = "If a user with that email is registered you will receive reset email"
    const { email } = req.body
    const user = await findUserByEmail(email)

    if (!user) {
        log.debug(`User with email ${email} not found`)        
        return res.send(message)
    }
    
    if (!user.verified) { 
        log.debug(`User with email ${email} not verified`)
    }

    const passwordResetCode = nanoid()

    user.passwordReset = passwordResetCode
    await user.save()

    // Send email with reset code
    await sendEmail({
        to: user.email,
        from: "shakibdshy@outlook.com",
        subject: "Reset your password",
        text: `Reset code: ${passwordResetCode}. Id: ${user._id}`,
    })

    log.debug(`User with email ${email} sent reset email`)

    return res.send(message)

}

export async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) { 
    const { id, passwordResetCode } = req.params
    const { password } = req.body
    const user = await findUserById(id)

    if (!user || !user.passwordReset || user.passwordReset !== passwordResetCode) {
        return res.status(400).send('Could not Reset Password')
    }
    
    user.password = password
    user.passwordReset = null
    await user.save()

    return res.send('Password Successfully Reset')
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(res.send(res.locals.user))
}
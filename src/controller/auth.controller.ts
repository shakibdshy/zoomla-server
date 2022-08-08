import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../service/auth.service";
import { findUserByEmail } from "../service/user.service";

export async function createSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response) {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
        return res.send({
            message: "Invalid email or password"
        });
    }

    if (!user.verified) {
        return res.send({
            message: "Please verify your email address"
        });
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
        return res.send("Invalid email or password");
    }

    // Sign a access token
    const accessToken = signAccessToken(user);

    // Sign a refresh token
    const refreshToken = await signRefreshToken({ userId: user._id});

    // Send the tokens to the client
    return res.send({
        accessToken,
        refreshToken
    })
}
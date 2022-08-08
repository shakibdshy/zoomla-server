import config from 'config';
import jwt from "jsonwebtoken";

export function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options?:jwt.SignOptions | undefined) {
    const signInKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

    return jwt.sign(object, signInKey, {
        ...(options && options),
        algorithm: "RS256",
    })
}

export function verifyJwt() {

}
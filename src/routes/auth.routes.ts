import express from "express";
import {
    createSessionHandler,
    refreshAccessTokenHandler,
} from "../controller/auth.controller";
import requiredUser from "../middleware/requerUser";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
);

router.post("/api/sessions/refresh", requiredUser, refreshAccessTokenHandler);

export default router;
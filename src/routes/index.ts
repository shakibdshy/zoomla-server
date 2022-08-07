import express from "express";
import userRoutes from './user.routes'
import authRoutes from './auth.routes'

const router = express.Router();

router.get('/check', (_, res) => res.sendStatus(200));

router.use(userRoutes)
router.use(authRoutes)

export default router;
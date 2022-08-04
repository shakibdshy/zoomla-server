import express from "express";
import userRoutes from './userRoutes'
import authRoutes from './authRoutes'

const router = express.Router();

router.get('/check', (_, res) => res.sendStatus(200));

router.use(userRoutes)
router.use(authRoutes)

export default router;
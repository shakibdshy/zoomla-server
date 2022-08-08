import fetch from "node-fetch";
import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import config from 'config';
import connect from './utils/connect';
import log from './utils/logger';
import router from './routes';
import deserializeUser from "./middleware/deserializeUser";

const port= config.get<number>('port');

const app = express();

app.use(express.json());
app.use(deserializeUser);
app.use(router);


app.listen(port, async () => {
    log.info(`Server is running at http://localhost:${port}`);

    await connect();
})



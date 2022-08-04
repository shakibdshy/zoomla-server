import mongoose from 'mongoose';
import config from 'config'
import log from "./logger";

const connect = async () => {
    const dbUri = config.get<string>('mongoURI');

    try {
        await mongoose.connect(dbUri)
        log.info(`Connected to MongoDB`);
    } catch (err) {
        console.error(`Could not connect to MongoDB:, ${err}`);
        process.exit(1);
    }
}

export default connect;
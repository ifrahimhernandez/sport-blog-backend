import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.uevbubw.mongodb.net/${MONGO_DATABASE}`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const BASE_URL = process.env.BASE_URL || '';
const SECRET = process.env.SECRET || '';

export const config = {
    mongo: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT,
        baseUrl: BASE_URL,
        secret: SECRET,
        roles: ['user', 'moderator', 'admin']
    }
};
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { fileURLToPath } from 'url'
import db from './config/database.js'
import usersModel from './models/usersModel.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js'

var app = express();

try {
    await db.authenticate();
    await usersModel.sync()
    console.log('Database connected...');
} catch (error) {
    console.log("🚀 ~ file: app.js:19 ~ error:", error)    
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter)

export default app;

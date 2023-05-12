import express from 'express';
import mongoose from 'mongoose';
import taskRouter from './controllers/tasks.js';
import userRouter from './controllers/users.js'
import webUserRouter from './webcontroller/users.js'
import config from './utils/config.js';
import logger from './utils/logger.js';

// for views

import path from 'path';
import hbs from 'hbs';
import cookieParser from 'cookie-parser';

const app = new express();
app.use(express.json())
// views
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// database connection 
mongoose.connect(config.MONGODB_URI).then(() => logger.info('database connected')).catch(e => logger.error(e))
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);

// set path for pulic folder
// const publicPath = path.join(process.cwd(), 'public');
// console.log(publicPath)
app.use(express.static('public'))

app.set('view engine', 'hbs');
// set pages and partials path
const viewsPath = path.join(process.cwd(), 'views', 'pages');
app.set('views', viewsPath);
const partialsPath = path.join(process.cwd(), 'views', 'partials');
hbs.registerPartials(partialsPath);

app.use('/', webUserRouter);



export default app;
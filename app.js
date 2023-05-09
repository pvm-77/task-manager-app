import express from 'express';
import mongoose from 'mongoose';
import TaskRouter from './controllers/tasks.js';
import config from './utils/config.js';
import logger from './utils/logger.js';
const app=new express();
app.use('/api',TaskRouter);
// database connection 
mongoose.connect(config.MONGODB_URI).then(()=>logger.info('database connected')).catch(e=>logger.error(e))
export default app;
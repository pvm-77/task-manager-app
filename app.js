import express from 'express';
import mongoose from 'mongoose';
import taskRouter from './controllers/tasks.js';
import userRouter from './controllers/users.js'
import config from './utils/config.js';
import logger from './utils/logger.js';
const app=new express();
app.use(express.json())
// database connection 
mongoose.connect(config.MONGODB_URI).then(()=>logger.info('database connected')).catch(e=>logger.error(e))

app.use('/api/tasks',taskRouter);
app.use('/api/users',userRouter);

export default app;
import Task from '../models/task.js';
import express from 'express';

import logger from '../utils/logger.js';

const TaskRouter = express.Router();

TaskRouter.get('/', (req, res) => {

});
TaskRouter.post('/', (req, res) => {

});
TaskRouter.get('/tasks', async(req, res) => {
    try {
        const tasks=await Task.find({})
        res.status(200).json(tasks);

    } catch (error) {
        res.status(404).json({error})

    }

});
TaskRouter.get('/task/:id', (req, res) => {
    try {
        
    } catch (error) {
        
    }

});
TaskRouter.delete('/', (req, res) => {

});

export default TaskRouter;




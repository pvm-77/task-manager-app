import Task from '../models/task.js';
import express from 'express';
import middlware from '../utils/middlware.js';
import logger from '../utils/logger.js';

const taskRouter = express.Router();

taskRouter.post('/', middlware.authenticateUser, async (req, res) => {
    const task = new Task({
        description: req.body.description,
        completed: req.body.completed,
        owner: req.user._id
    })
    try {
        const result = await task.save()
        res.status(201).json({ "taskData": result, "message": "new task create successfully" });
    }
    catch (error) {
        res.status(500).json({ 'error': error.message });
    }


});

taskRouter.get('/', middlware.authenticateUser, async (req, res) => {

    try {
        await req.user.populate('tasks')
        res.status(200).json({'taskData':req.user.tasks})
    } catch (error) {
        res.status(500).json({ "error": error.message })

    }

});
taskRouter.get('/:id', (req, res) => {
    try {

    } catch (error) {

    }

});
taskRouter.delete('/', middlware.authenticateUser, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }

});
taskRouter.patch('/:id', middlware.authenticateUser, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' })
    }
    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })


        if (!task) {
            return res.status(404).json({"error":'task not found'});
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).json({"message":"data update successfully",task})
    }
    catch (error) {
        res.status(400).json({"error":error.message})
    }
})
export default taskRouter;

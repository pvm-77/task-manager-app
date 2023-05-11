import express, { json } from 'express';
import User from '../models/user.js'
import logger from '../utils/logger.js'
import middleware from '../utils/middlware.js'
const userRouter = express.Router();

// create user
userRouter.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ error: error.message })

    }

})

// get all users
userRouter.get('/', async (req, res) => {

    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
// get single user by ID
userRouter.get('/:id', async (req, res) => {
    logger.info(`user id is ${req.params.id}`);
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: `User with id ${req.params.id} not found` })
        }
        res.status(200).json({ message: 'user found', user });
    } catch (error) {
        res.status(500).json({ error: error.message })

    }

})

userRouter.patch('/:id', async (req, res) => {

    try {

        const allowedUserFields = ['name', 'email', 'password'];
        const updatedUserFields = Object.keys(req.body);
        const invalidUpdates = updatedUserFields.filter((field) => !allowedUserFields.includes(field));
        if (invalidUpdates.length) {
            return res.status(400).send({ error: `Invalid updates : ${invalidUpdates.join(', ')}` });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: `User with id ${req.params.id} not found` })
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).json({ message: 'update user detail successfully', user: updatedUser })

    } catch (error) {
        console.log('catch')
        res.status(500).json({ error: error.message })

    }

})

userRouter.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ error: `User with id ${req.params.id} not found` })
        }
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message })

    }

})


userRouter.post('/login', async (req, res) => {
    console.log('in login controller');
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).json({user,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


userRouter.post('/logout', middleware.authenticateUser, async (req, res) => {
    try {
        console.log('token send by req:',req.token)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).json({ message: 'logout successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default userRouter;


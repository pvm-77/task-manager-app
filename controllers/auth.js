import express from 'express'
import User from '../models/user.js'
const authRouter = express();
authRouter.post('/login', async(req, res) => {
    try {
        // validations if applied
        const user=await User.findByCredentials(req.body.email,req.body.password)
        console.log('user in login is ',user)
        
        res.status().json();
    } catch (error) {
        res.status().json();

    }
})
authRouter.post('/logout', (req, res) => {
    try {
        res.status().json();
    } catch (error) {
        res.status().json();

    }
})
export default authRouter;
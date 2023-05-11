import jwt from 'jsonwebtoken';
import User from '../models/user.js'
import config from '../utils/config.js'
const auth = async (req, res, next) => {

    // console.log('auth middleware')
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('token in middleware',token)
        const decoded = jwt.verify(token, config.JWT_SECRET);
        // console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.user = user;
        next()

    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' })
    }


}

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        console.log('token receive in middlware',token)
        const decoded = jwt.verify(token, config.JWT_SECRET)
        // console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' })
    }
}


export default {authenticateUser};
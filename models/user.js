
import mongoose from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import config from '../utils/config.js'
// const Task = require('./task')
import Task from './task.js'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')

                }
            }

        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('password must not contain word password')
                }
            }

        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('age must be positive number')

                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },
    {
        timestamps: true
    }
)
// virtual data for user
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    console.log('in find by credentials method');
    const user = await User.findOne({ email })
    console.log('user mila',user)
    if (!user) {
        throw new Error('user not exist')
    }
    console.log('passfrom client',password);
    console.log('passfrom server',user.password);
    const isMatch = await bcrypt.compare(password, user.password)
    console.log('match value',isMatch)
    if (!isMatch) {
        throw new Error('unable to login')
    }
    // const isMatch = password === user.password ? true : false;
    // if (!isMatch) {
    //     throw new Error('unable to login')
    // }
    return user
}
// get user public profile and hide token and password info
// userSchema.methods.getPublicProfile= function(){
//     const user = this
//     const userObject = user.toObject()
//     delete userObject.password 
//     delete userObject.tokens
//     return userObject
// }
// alternative way to get public profile
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

// generate auth token function on user instance
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, config.JWT_SECRET, { expiresIn: '7 days' })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// pre hook middleware
userSchema.pre('save', async function (next) {
    // this referred to current document of user
    const user = this
    // console.log('just before saving user')

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


// delete the task tasks when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

const User = mongoose.model('User', userSchema)

// module.exports = User

export default User;
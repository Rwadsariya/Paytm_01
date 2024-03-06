const express = require('express');

const zod = require('zod');
const User = require('../db');
const require = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const authMiddleware = require('../middleware');
const { router } = require('.');


const userRouter = express.Router();

const signupSchema =  zod.object({
    username: zod.string().zod.email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})

userRouter.post('/signup', async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Invalid input/email already taken!!"
        })
    }

    const user = User.findOne({
        username: body.username
    })

    if(user){
        return res.status(411).json({
            message: "Invalid input/email already taken!!"
        })
    }

    const dbUser = await user.create(body);
    const token = jwt.sign({
        userId: dbUser._id,
    }, JWT_SECRET);

    res.json({
        message: "User created Successfully!",
        token 
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post('/signin', async (req, res) => {
    const body = req.body;
    const {success} = signinBody.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Invalid INPUT!!"
        })
    }

    const user = await user.findOne({
        username: body.username,
        password: body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);

        res.json(token);
        return;
    }

    res.status(403).json({
        message: "error while logging in."
    })

})

const updateUserSchema = {
    username: zod.string(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
}

userRouter.put('/',authMiddleware,async (req, res) => {
    const body = req.body;
    const {success} = updateUserSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating user information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({message: "Successfully updated"});
})

userRouter.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or : [{
            firstname: { $regex: filter, $options: 'i' } ,
            lastname: { $regex: filter, $options: 'i'}
        }]
    })

    res.json({
        users: users.map((user)=>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            user_id: user.id
        }))
    })
})


module.exports = userRouter;
const express = require('express');

const zod = require('zod');
const User = require('../db');
const require = require('jsonwebtoken');
const JWT_SECRET = require('../config');

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

module.exports = userRouter;
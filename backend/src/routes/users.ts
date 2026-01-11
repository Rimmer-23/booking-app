import express, { type Request, type Response } from 'express';
import User from '../models/user.ts';
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();



// /api/users/register
router.post("/register", [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        // Registration logic here
        let user = await User.findOne({
            email: req.body.email,

        });
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        user = new User(req.body);
        await user.save();

        const token = jwt.sign(
            {userId: user.id}, 
            process.env.JWT_SECRET_KEY as string,
            {expiresIn: "1d"}
        );

        res.cookie("auth_token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            maxAge: 86400000, // 1 day
        });
        return res.status(200).send({message: "User registered successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;


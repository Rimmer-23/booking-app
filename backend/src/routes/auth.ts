import express from 'express';
import { type Request, type Response } from 'express';
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from '../models/user.ts';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists(),

], async (req: Request, res: Response) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()});
    }

    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return  res.status(400).json({message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
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
        res.status(200).json({userId: user._id}); // Send userId in response on successful login 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
export default router;
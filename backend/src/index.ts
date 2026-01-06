//rest api server
import express from "express";
import cors from "cors";
import "dotenv/config";
import type { Request, Response } from "express";
import mongoose from "mongoose";


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true})); // help parse url, 
app.use(cors());

app.get("/api/test", async (req: Request, res: Response)=>{
    res.json({message:"hello from express endpoint"});
});

app.listen(7000, ()=>{
    console.log("Server is running on port 7000");
});
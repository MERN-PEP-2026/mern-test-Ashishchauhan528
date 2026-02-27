import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        const existing = await Student.findOne({email});
        if(existing){
            return res.status(400).json({message:'User already exists'});
        }
        const hashed = await bcrypt.hash(password,10);
        await Student.create({name,email,password:hashed});
        res.status(201).json({message:'User registered successfully'});
    }catch(err){
        res.status(500).json({message:'Something went wrong'});
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const student = await Student.findOne({email});
        if(!student){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const match = await bcrypt.compare(password,student.password);
        if(!match){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const token = jwt.sign({id:student._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(200).json({token});
    }catch(err){
        res.status(500).json({message:'Something went wrong'});
    }
}
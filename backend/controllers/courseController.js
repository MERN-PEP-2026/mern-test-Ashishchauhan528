import Course from '../models/Course.js';

export const createCourse = async(req,res)=>{
    try{
        const course = await Course.create(req.body);
        res.status(201).json(course);
    }catch(err){
        console.error('Course Error',err);
        res.status(500).json({message:'Something went wrong'});
    }
};

export const getCourse = async(req,res)=>{
    try{
        const courses = await Course.find();
        res.status(200).json(courses);
    }catch(err){
        res.status(500).json({message:'Something went wrong'});
    }
};

export const deleteCourse = async(req,res)=>{
    try{
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({message:'Course deleted successfully'});
    }catch(err){
        res.status(500).json({message:'Something went wrong'});
    }
};
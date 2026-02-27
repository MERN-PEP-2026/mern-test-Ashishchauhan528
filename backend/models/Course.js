import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String
    },
    instructor:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model('Course',CourseSchema);
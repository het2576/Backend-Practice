import mongoose from "mongoose";



const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email : {type : String , unique : true},
    password : String,
    firstName : String,
    lastName : String 
});

const adminSchema = new Schema({
    email : {type : String , unique : true},
    password : String,
    firstName : String,
    lastName : String 
});

const courseSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl: String,
    creatorId : ObjectId
});

const purchaseSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId
});

export const userModel = mongoose.model("user", userSchema);
export const adminModel = mongoose.model("admin", adminSchema);
export const courseModel = mongoose.model("course", courseSchema);
export const purchaseModel = mongoose.model("purchase", purchaseSchema);
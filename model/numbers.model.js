import mongoose from "mongoose";

const NumbersSchema = new mongoose.Schema({
    name : {
        type:String,
        unique:true
    },
    value : {
        type: Number,
        required:true
    }
})


export default mongoose.model("numbers", NumbersSchema)
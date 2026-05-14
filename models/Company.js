import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
    companyName: String,
    description: String,
    logo:String,
    location: String,
    createdBy : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
},
{timestamps:true,}
);
export default  mongoose.model(
    "Company",
    companySchema
);
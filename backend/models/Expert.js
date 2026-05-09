import mongoose from "mongoose";

const Expertschema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    category: {
        type : String,
        required : true
    },
    experience: {
        type : Number,
        required : true
    },
     rating: {
        type : Number,
        required : true
     }
})

const Expert = mongoose.model('Expertdata',Expertschema);

export default Expert;



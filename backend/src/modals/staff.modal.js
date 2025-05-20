import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },

    Email: {
        type: String,
        required: true,
        unique: true
    },

    Mobile_number: {
        type: String,
        required: true,
    },

    Address: {
        type: String,
        required: true
    },

    Role: {
        type: String,
        required: true
    },

    Salary: { 
        type: String,
        required: true
    },

    Joining_date: { 
        type: String,
        required: true
    },

    Status: {  
        type: String,
        required: true
    }
    }, 

{
    timestamps: true
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
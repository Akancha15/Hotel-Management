import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },

    Amount: {
        type: String,
        required: true
    },

    Transaction_type: {
        type: String,
        required: true,
    },

    Category: {
        type: String,
        required: true
    },

    Payment_mode: {
        type: String,
        required: true
    },

    Transaction_ondate: {  
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

const Finance = mongoose.model("Finance", financeSchema);

export default Finance;
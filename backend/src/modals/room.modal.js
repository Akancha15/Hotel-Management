import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    Room_number: {
        type: String,
        required: true
    },


    Room_type: {
        type: String,
        required: true
    },


    Bed_type: {
        type: String,
        required: true
    },


    Price_pernight: {
        type: String,
        required: true
    },



    Description: {
        type: String,
        required: true
    },


    Capacity: {
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
    
}
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
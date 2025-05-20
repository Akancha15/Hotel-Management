import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    Booking_id: {
        type: String,
        required: true
    },

    Guest_name: {
        type: String,
        required: true
    },

    Guest_email: {
        type: String,
        required: true,
        unique: true
    },

    Guest_phone: {
        type: String,
        required: true
    },

    Guest_address: {
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

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
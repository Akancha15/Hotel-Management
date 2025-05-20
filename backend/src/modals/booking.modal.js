import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    Customer_name: {
        type: String,
        required: true
    },

    Room_number: {
        type: String,
        required: true
    },

    Booking_date: {
        type: String,
        required: true,
    },

    Total_price: {  
        type: String,
        required: true
    },

    Check_in: {  
        type: String,
        required: true
    },

    Check_out: {  
        type: String,
       
    },

    Payment_status: {  
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

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
import mongoose from "mongoose";

const discountSchema= new mongoose.Schema({
    Discount_code: {
        type: String,
        required: true
    },

    Discount_description: {
        type: String,
        required: true
    },

    Discount_value: {
        type: String,
        required: true
    },

    Valid_from: {
        type: String,
        required: true
    },

    Valid_to: {
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

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
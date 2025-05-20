import Discount from "../modals/discount.modal.js";
import mongoose from "mongoose";

//Add-Discount
export const addDiscount = async (req,res) =>{
    try{
        console.log("request body :", req.body);
        const{ Discount_code, Discount_description, Discount_value, Valid_from, Valid_to ,Status} = req.body;

        if( !Discount_code || !Discount_description || !Discount_value || !Valid_from || !Valid_to || !Status){
            console.error("validation error : missing field in request");
            return res.status(400).json({message:"All field are required"});
        }
        const newDiscount = new Discount({ Discount_code, Discount_description, Discount_value, Valid_from, Valid_to ,Status})
        await newDiscount.save();
        console.log("Discount created for you sucessfully",newDiscount);
        res.status(201).json({ message: "Discount created successfully",newDiscount });

    } catch(error){
      console.error("server error", error.message);
      res.status(500).json({message: "server error" ,error : error.message})
    }
}

//Get all list of Discount
export const getAllDiscount = async (req,res) =>{
    try{
        const discount = await Discount.find();
        res.status(200).json({ message: "All Discount Fetched", discount});
    } catch(error){
        console.error("server error", error.message);
        res.status(500).json({message: "server error" ,error : error.message})
    }
}

//Update Discount
export const updateDiscount = async (req,res) =>{
    try{
        const { id } = req.params; // Get the _id from the URL
        const updatedData = req.body; // Get updated data from request body

    // Find the document by ID and update it
    const updatedDiscount = await Discount.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedDiscount) {
        return res.status(404).json({ message: "Discount not found" });
    }

    res.status(200).json({ message: "Discount updated successfully", updatedDiscount });
} catch (error) {
        console.error("server error", error.message);
        res.status(500).json({message: "server error" ,error : error.message})
    }
}

//Delete Discount
export const deleteDiscount = async (req,res) =>{
    try{
        const { id } = req.params;

        const deletedDiscount = await Discount.findByIdAndDelete(id);

        if(!deletedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.status(200).json({ message: "Discount deleted successfully", deletedDiscount });
    } catch(error){
        console.error("server error", error.message);
        res.status(500).json({message: "server error" ,error : error.message})
    }
}
import Finance from "../modals/finance.modal.js";
import mongoose from "mongoose";

// add finance
export const addFinance = async(req, res) => {
    try{
      console.log("request body : ", req.body);
      const {Name, Amount, Transaction_type, Category, Payment_mode, Transaction_ondate, Status} = req.body;
      
      if(!Name || !Amount || !Transaction_type || !Category || !Payment_mode || !Transaction_ondate || !Status){
        console.error("validation error : missing field in request");
        return res.status(400).json({message: "all fields are required"});
      }
      const newFinance = new Finance({Name, Amount, Transaction_type, Category, Payment_mode, Transaction_ondate, Status})
      await newFinance.save();
      console.log("Finance created succsessfully", newFinance);

      res.status(201).json({ message: "Finance created successfully", newFinance });

    } catch(error){
      console.error("server error", error.message);
      res.status(500).json({message: "server error" ,error : error.message})
    }
}

//get all finance
export const getAllFinance = async(req, res) => {
  try{
   const finance = await Finance.find();
   res.status(200).json({ message: "all finance fetched", finance});
  } catch(error){
    console.error("server error", error.message);
    res.status(500).json({message: "server error" ,error : error.message})
  }
}

//delete finanace
export const deletedFinance = async(req, res) => {
  try {
    const {id}  = req.params;
    const deletedFinance = await Finance.findByIdAndDelete(id);

    if (!deletedFinance) {
      return res.status(404).json({ message: 'Finance not found' });
    }

    res.json({ message: 'Finance deleted successfully', deletedFinance });
  } catch (error) {
    res.status(500).json({ error: 'Server error',error : error.message });
  }
}

//update finance
export const updateFinance = async(req,res) => {
  try{
    const { id } = req.params; 
    const updateData = req.body;
    const deleteFinance = await Finance.findByIdAndUpdate(id, updateData, { new: true });

    if (!deleteFinance) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: deleteFinance});

  }catch(error){
    res.status(500).json({ message: 'Error updating user', error: error.message || error });
  }
}
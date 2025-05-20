import Staff from "../modals/staff.modal.js";
import mongoose from "mongoose";

// addstaff
export const addStaff = async(req, res) => {
    try{
      console.log("request body : ", req.body);
      const {Name, Email, Mobile_number, Address, Role, Salary, Joining_date, Status} = req.body;
      
      if(!Name || !Email || !Mobile_number || !Address || !Role || !Salary || !Joining_date || !Status){
        console.error("validation error : missing field in request");
        return res.status(400).json({message: "all fields are required"});
      }
      const newStaff = new Staff({Name, Email, Mobile_number, Address, Role, Salary, Joining_date, Status})
      await newStaff.save();
      console.log("Staff created succsessfully", newStaff);

      res.status(201).json({ message: "Staff created successfully", newStaff });

    } catch(error){
      console.error("server error", error.message);
      res.status(500).json({message: "server error" ,error : error.message})
    }
}

//get all staff
export const getAllStaff = async(req, res) => {
  try{
   const staff = await Staff.find();
   res.status(200).json({ message: "all staff fetched", staff});
  } catch(error){
    console.error("server error", error.message);
    res.status(500).json({message: "server error" ,error : error.message})
  }
}

//delete guest
export const deletedStaff = async(req, res) => {
  try {
    const {id}  = req.params;
    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ message: 'Staff deleted successfully', deletedStaff });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//update staff
export const updateStaff = async(req,res) => {
  try{
    const { id } = req.params; 
    const updateData = req.body;
    const updateStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true });

    if (!updateStaff) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updateStaff});

  }catch(error){
    res.status(500).json({ message: 'Error updating user', error });
  }
}

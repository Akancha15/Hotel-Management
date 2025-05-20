import Guest from "../modals/guest.modal.js";
import mongoose from "mongoose";

// add guest
export const addGuest = async(req, res) => {
    try{
      console.log("request body : ", req.body);
      const {Booking_id, Guest_name, Guest_email, Guest_phone, Guest_address,Status} = req.body;
      
      if(!Booking_id || !Guest_name || !Guest_email || !Guest_phone || !Guest_address || !Status){
        console.error("validation error : missing field in request");
        return res.status(400).json({message: "all fields are required"});
      }
      const newGuest = new Guest({Booking_id, Guest_name, Guest_email, Guest_phone, Guest_address, Status})
      await newGuest.save();
      console.log("guest created succsessfully", newGuest);

      res.status(201).json({ message: "Guest created successfully",newGuest });

    } catch(error){
      console.error("server error", error.message);
      res.status(500).json({message: "server error" ,error : error.message})
    }
}

//get all guests
export const getAllGuest = async(req, res) => {
  try{
   const guest = await Guest.find();
   res.status(200).json({ message: "all guest fetched", guest});
  } catch(error){
    console.error("server error", error.message);
    res.status(500).json({message: "server error" ,error : error.message})
  }
}

//delete guest
export const deletedGuest = async(req, res) => {
  try {
    const {id}  = req.params;
    const deletedGuest = await Guest.findByIdAndDelete(id);

    if (!deletedGuest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.json({ message: 'Guest deleted successfully', deletedGuest });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//update guest
export const updateGuest = async(req,res) => {
  try{
    const { id } = req.params; 
    const updateData = req.body;
    const updateGuest = await Guest.findByIdAndUpdate(id, updateData, { new: true });

    if (!updateGuest) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updateGuest});

  }catch(error){
    res.status(500).json({ message: 'Error updating user', error });
  }
}
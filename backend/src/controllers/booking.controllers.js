import Booking from "../modals/booking.modal.js";
import Room from "../modals/room.modal.js";
import mongoose from "mongoose";

// add booking
export const addbooking = async(req, res) => {
    try{
      console.log("request body : ", req.body);
      const {Customer_name, Room_number, Booking_date, Total_price, Check_in, Check_out, Payment_status, Status} = req.body;
      
      if(!Customer_name || !Room_number || !Booking_date || !Total_price || !Check_in  || !Payment_status || !Status ){
        console.error("validation error : missing field in request");
        return res.status(400).json({message: "all fields are required"});
      }
      const newBooking = new Booking({Customer_name, Room_number, Booking_date, Total_price, Check_in, Check_out,  Payment_status, Status})
      await newBooking.save();
      console.log("Booking created succsessfully", newBooking);

      res.status(201).json({ message: "Booking created successfully", newBooking });

    } catch(error){
      console.error("server error", error.message);
      res.status(500).json({message: "server error" ,error : error.message})
    }
}

//get all Booking
export const getAllBooking = async(req, res) => {
  try{
   const booking = await Booking.find();
   res.status(200).json({ message: "all Booking fetched", booking});
  } catch(error){
    console.error("server error", error.message);
    res.status(500).json({message: "server error" ,error : error.message})
  }
}

//delete Booking
export const deletedBooking = async(req, res) => {
  try {
    const {id}  = req.params;
    const deleteBooking = await Booking.findByIdAndDelete(id);

    if (!deleteBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully', deleteBooking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//update booking
export const updateBooking = async(req,res) => {
  try{
    const { id } = req.params; 
    const updateData = req.body;
    const updateBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    if (!updateBooking) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updateData.Status === "Check_in") {
      await Room.findOneAndUpdate({ Room_number: updateBooking.Room_number }, { Status: "Unavailable" });
    } else if (updateData.Status === "Check_out") {
      await Room.findOneAndUpdate({ Room_number: updateBooking.Room_number }, { Status: "Available" });
    }

    res.json({ message: 'User updated successfully', user: updateBooking});

  }catch(error){
    res.status(500).json({ message: 'Error updating user', error });
  }
}
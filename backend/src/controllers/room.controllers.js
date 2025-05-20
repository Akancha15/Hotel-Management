import Room from "../modals/room.modal.js";
import mongoose from "mongoose";

//add room
export const addRoom = async(req , res) => {
    try{
        console.log("request body :", req.body);
        const{Room_number, Room_type, Bed_type, Price_pernight, Description,Capacity, Status } =req.body;

        if(!Room_number|| !Room_type || !Bed_type || !Price_pernight || !Description || !Capacity || !Status ){

            console.error("validation error : missing field in request");
            return res.status(400).json({message: "all fields are required"});
        }
         
        const newRoom = new Room({Room_number, Room_type, Bed_type, Price_pernight, Description, Capacity, Status})
            await newRoom.save();
            res.status(200).json({ status: "success", message: "Room created Successfully!" });
            console.log("room created succsessfully", newRoom);
            
    }  catch(error){
        console.error("server error", error.message);
        res.status(500).json({message: "server error" ,error : error.message})
    }
}

//get all rooms
export const getAllRoom =  async(req , res) => {
   try{
        const room = await Room.find();
        res.status(200).json({message: "all room fetched" , room})
    }catch(error){
        console.error("server error", error.message)
        res.status(500).json({message: "server error" ,error : error.message})
    }
}


//delete Room by ID
export const deletedRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
          
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
          
        res.json({ message: "Room deleted successfully", deletedRoom });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
          
          

//update Room by ID
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get updated data from request body
        const updateRoom = await Room.findByIdAndUpdate(id, updateData, { new: true });

        if (!updateRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Room updated successfully", room: updateRoom });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
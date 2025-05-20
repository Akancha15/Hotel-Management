import * as React from 'react';
import { useState, useEffect } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Search from "../Search/Search.js";


const RoomTable = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoom, setFilteredRoom] = useState([]);
  const [searchField, setSearchField] = useState();
  //booking
  const [bookings, setBookings] = useState([]); 
  
  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/room";

  //Discount Base URL
  const BOOKING_BASE_URL = "http://localhost:4000/booking";

  // Fetch Branches from API
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-room`);
      console.log("Fetching Rooms - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.room)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setRooms([]);
        return;
      }

      const roomData = response.data.room;
      console.log("Processed Room data:", roomData);

      if (roomData.length === 0) {
        console.log("No Rooms found in the response");
      }

      // Fetch bookings to determine room status
      const bookingsResponse = await axios.get(`${BOOKING_BASE_URL}/get-booking`);
      const bookingsData = bookingsResponse.data.booking;

      // Update room status based on bookings
      const updatedRooms = roomData.map(room => {
        const roomBooking = bookingsData.find(booking => 
          booking.Room_number?.toString() === room.Room_number?.toString() && 
          booking.Status === 'Check_in'
        );
        
        return {
          ...room,
          Status: roomBooking ? 'Unavailable' : 'Available'
        };
      });

      setRooms(updatedRooms);
    } catch (error) {
      console.error("Error fetching Room details:", error);
      toast.error(error.response?.data?.message || "Error loading Room details");
      setRooms([]);
    }
  };

  useEffect(() => {
    console.log("Initiating Rooms data fetch...");
    fetchRooms();
  }, []);

  //fetch Booking API
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BOOKING_BASE_URL}/get-booking`);
      console.log("Fetching bookings - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.booking)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setBookings([]);
        return;
      }

      const bookingData = response.data.booking;
      console.log("Processed room data:", bookingData);

      if (bookingData.length === 0) {
        console.log("No bookings found in the response");
      }

      setBookings(bookingData);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error(error.response?.data?.message || "Error loading booking details");
      setBookings([]);
    }
  };

  useEffect(() => {
    console.log("Initiating bookings data fetch...");
    fetchBookings();
  }, []);

  
  //add serach effect
  useEffect(() => {
   if(!searchTerm){
    setFilteredRoom(rooms);
    return;
   }

   const filtered = rooms.filter((room) =>{
    if(!room[searchField]) return false;
    return room[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
   });

   setFilteredRoom(filtered);
  },[searchTerm, searchField, rooms]);

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedRoom(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedRoom({
      id: '',
      Room_number: '',
      Room_type: '',
      Bed_type: '',
      Price_pernight: '',
      Description: '',
      Capacity: '',
      Status:'',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setIsEditing(true);
    setOpen(true);
  };
  

  const handleView = (room) => {
    setSelectedRoom(room);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-room/${id}`)
      .then(() => {
        toast.success("Room deleted successfully");
        fetchRooms();
      })
      .catch(error => {
        console.error("Error deleting Room:", error);
        toast.error("Failed to delete Room");
      });
  };
  
  

  const handleSave = () => {
    if (!selectedRoom) return;

    console.log("Saving Room:", selectedRoom);

    if (isEditing) {
        if (!selectedRoom._id) {
            console.error("Room ID is missing!");
            toast.error("Room ID is missing!");
            return;
        }

        axios.put(`${API_BASE_URL}/update-room/${selectedRoom._id}`, selectedRoom)
            .then(response => {
                console.log("Updated Room:", response.data);
                toast.success("Room updated successfully");
                handleClose();
                fetchRooms();
            })
            .catch(error => {
                console.error("Error updating Room:", error);
                toast.error("Failed to update Room");
            });
    } else {
        axios.post(`${API_BASE_URL}/add-room`, selectedRoom)
            .then(response => {
                console.log("Added Room:", response.data);
                toast.success("Room added successfully");
                handleClose();
                fetchRooms();
            })
            .catch(error => {
                console.error("Error adding Room:", error);
                toast.error("Failed to add Room");
            });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedRoom = {
      ...selectedRoom,
      [name]: value,
    };

    // If status is being changed, update related bookings
    if (name === 'Status') {
      const relatedBookings = bookings.filter(booking => 
        booking.Room_number?.toString() === updatedRoom.Room_number?.toString()
      );

      // Update related bookings based on room status
      const updatedBookings = bookings.map(booking => {
        if (booking.Room_number?.toString() === updatedRoom.Room_number?.toString()) {
          return {
            ...booking,
            Status: value === 'Available' ? 'Check_out' : 'Check_in'
          };

        }
        return booking;
      });

      setBookings(updatedBookings);
    }

    setSelectedRoom(updatedRoom);
  };

  return (
    <>
      <Box style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex", alignItems:"center", gap:"15px", marginBottom: "10px", marginTop: "10px"}}>
      <TextField
        className="search"
        select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        size="small"
        variant="outlined"
        label="Room Type"
      >
        <MenuItem value="Room_number">Room Number</MenuItem>
        <MenuItem value="Room_type">Room Type</MenuItem>
        <MenuItem value="Bed_type">Bed Type</MenuItem>
        <MenuItem value="Price_pernight">Price Per Night</MenuItem>
        <MenuItem value="Capacity">Capacity</MenuItem>
      </TextField>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

        <Button 
            variant="contained"
            color="primary"
            className="primary-button"
            startIcon={<AddIcon />} 
            onClick={handleAdd}> 
            Add New Room
        </Button>  
      </Box>

  
    
      <div className="room-table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow >
              <TableCell><b>SL No.</b></TableCell>
              <TableCell><b>Room Number</b></TableCell>
              <TableCell><b>Room Type</b></TableCell>
              <TableCell><b>Bed Type</b></TableCell>
              <TableCell><b>Price/Day</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Capacity</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoom.map((room, index) => (
              <TableRow key={room.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{room.Room_number}</TableCell>
                <TableCell>{room.Room_type}</TableCell>
                <TableCell>{room.Bed_type}</TableCell>
                <TableCell>{room.Price_pernight}</TableCell>
                <TableCell>{room.Description}</TableCell>
                <TableCell>{room.Capacity}</TableCell>
                <TableCell>{room.Status}</TableCell>
                <TableCell className='Action-btn'>
                  <IconButton onClick={() => handleView(room)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(room)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(room._id)} color="error">
                    <DeleteIcon />
                  </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Room' : 'Add New Room'}
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '100vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
          <Box className="form-fields">
            <TextField
              name="Room_number"
              label="Room Number"
              value={selectedRoom?.Room_number || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />

            <TextField
              name="Room_type"
              label="Room Type"
              value={selectedRoom?.Room_type || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Double">Double</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
                <MenuItem value="King">King</MenuItem>
                <MenuItem value="Queen">Queen</MenuItem>
            </TextField>

            
            <TextField
              name="Bed_type"
              label="Bed Type"
              value={selectedRoom?.Bed_type || ''}
              onChange={handleChange}
              fullWidth
              select
              margin="normal"
            >
                <MenuItem value="Single Bed">Single Bed</MenuItem>
                <MenuItem value="Double Bed">Double Bed</MenuItem>
                <MenuItem value="Queen Bed">Queen Bed</MenuItem>
                <MenuItem value="King Bed">King Bed</MenuItem>
                <MenuItem value="Sofa Bed">Sofa Bed</MenuItem>
                <MenuItem value="Twin Beds">Twin Beds</MenuItem>
            </TextField>
              
            <TextField
              name="Price_pernight"
              label="Price/Day"
              value={selectedRoom?.Price_pernight || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />

            <TextField
              name="Description"
              label="Description"
              value={selectedRoom?.Description || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              name="Capacity"
              label="Capacity"
              value={selectedRoom?.Capacity || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />

            <TextField
              name="Status"
              label="Status"
              value={selectedRoom?.Status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
                <MenuItem value="Under_Maintenance">Under Maintenance</MenuItem>
            </TextField>
              
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} fullWidth >
        <DialogTitle>
          Room Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 5, top: 5}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRoom && (
            <Box className="view-details">
              <div><strong>Room Number :</strong> {selectedRoom.Room_number}</div>
              <div><strong>Room Type :</strong> {selectedRoom.Room_type}</div>
              <div><strong>Bed Type :</strong> {selectedRoom.Bed_type}</div>
              <div><strong>Price/Day :</strong> {selectedRoom.Price_pernight}</div>
              <div><strong>Description :</strong> {selectedRoom.Description}</div>
              <div><strong>Capacity :</strong> {selectedRoom.Capacity}</div>
              <div><strong>Status :</strong> {selectedRoom.Status}</div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default RoomTable;
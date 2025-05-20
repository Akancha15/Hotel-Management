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


const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [searchField, setSearchField] = useState();
  
  const [rooms, setRooms] = useState([]);  //room
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [discounts, setDiscounts] = useState([]);  //discount
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  
  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/booking";

  //Room api_base_url
  const ROOM_BASE_URL = "http://localhost:4000/room";

  //Discount api_base_url
  const DISCOUNT_BASE_URL = "http://localhost:4000/discount";

  // Fetch Branches from API
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-booking`);
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

  //Fetch Room 
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${ROOM_BASE_URL}/get-room`);
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

      setRooms(roomData);
      setFilteredRooms(roomData);

    } catch (error) {
      console.error("Error fetching Room details:", error);
      toast.error(error.response?.data?.message || "Error loading Room details");
      setRooms([]);
      setFilteredRooms([]);
    }
  };

  useEffect(() => {
    console.log("Initiating Rooms data fetch...");
    fetchRooms();
  }, []);
  
  //Fetch Discount
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${DISCOUNT_BASE_URL}/get-alldiscount`);
      console.log("Fetching discounts - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.discount)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setDiscounts([]);
        return;
      }

      const discountData = response.data.discount;
      console.log("Processed discount data:", discountData);

      if (discountData.length === 0) {
        console.log("No discounts found in the response");
      }

      setDiscounts(discountData);
      setFilteredDiscounts(discountData);

    } catch (error) {
      console.error("Error fetching discount details:", error);
      toast.error(error.response?.data?.message || "Error loading discount details");
      setDiscounts([]);
      setFilteredDiscounts([]);
    }
  };

  useEffect(() => {
    console.log("Initiating discounts data fetch...");
    fetchDiscounts();
  }, []);
  

  //add serach effect
  useEffect(() => {
   if(!searchTerm){
    setFilteredBooking(bookings);
    return;
   }

   const filtered = bookings.filter((booking) =>{
    if(!booking[searchField]) return false;
    return booking[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
   });

   setFilteredBooking(filtered);
  },[searchTerm, searchField, bookings]);

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedBooking(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedBooking({
      Customer_name: '',
      Room_number: '',
      Booking_date: '',
      Total_price: '',
      Check_in: '',
      Check_out: '',
      Payment_status:'',
      Status:'',
      Discount_code: ''
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
    setOpen(true);
  };
  

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-booking/${id}`)
      .then(() => {
        toast.success("booking deleted successfully");
        fetchBookings();
      })
      .catch(error => {
        console.error("Error deleting booking:", error);
        toast.error("Failed to delete booking");
      });
  };
  
  const handleSave = () => {
    if (!selectedBooking) return;

    console.log("Saving booking:", selectedBooking);

    // Update room status before saving
    const selectedRoom = rooms.find(room => room.Room_number?.toString() === selectedBooking.Room_number?.toString());
    if (selectedRoom) {
        const updatedRooms = rooms.map(room => {
            if (room.Room_number?.toString() === selectedBooking.Room_number?.toString()) {
                return {
                    ...room,
                    Status: selectedBooking.Status === 'Check_In' ? 'Unavailable' : 'Available'
                };
            }
            return room;
        });
        setRooms(updatedRooms);
    }

    if (isEditing) {
        if (!selectedBooking._id) {
            console.error("Booking ID is missing!");
            toast.error("Booking ID is missing!");
            return;
        }

        axios.put(`${API_BASE_URL}/update-booking/${selectedBooking._id}`, selectedBooking)
            .then(response => {
                console.log("Updated booking:", response.data);
                toast.success("Booking updated successfully");
                handleClose();
                fetchBookings();
            })
            .catch(error => {
                console.error("Error updating booking:", error);
                toast.error("Failed to update booking");
            });
    } else {
        axios.post(`${API_BASE_URL}/add-booking`, selectedBooking)
            .then(response => {
                console.log("Added booking:", response.data);
                toast.success("Booking added successfully");
                handleClose();
                fetchBookings();
            })
            .catch(error => {
                console.error("Error adding booking:", error);
                toast.error("Failed to add booking");
            });
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    const updateBooking = {
      ...selectedBooking,
      [name]: value,
    };
  
    const selectedRoom = rooms.find(room => room.Room_number?.toString() === updateBooking.Room_number?.toString());
    const selectedDiscount = discounts.find(discount => discount.Discount_code?.toString() === updateBooking.Discount_code?.toString());

    const basePrice = selectedRoom ? selectedRoom.Price_pernight : 0;
    const discountPercent = selectedDiscount ? selectedDiscount.Discount_value : 0;

    // Calculate number of nights
    let numberOfNights = 1;
    if (updateBooking.Check_in && updateBooking.Check_out) {
        const checkInDate = new Date(updateBooking.Check_in);
        const checkOutDate = new Date(updateBooking.Check_out);
        const diffTime = checkOutDate - checkInDate;
        numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (numberOfNights <= 0) numberOfNights = 1;
    }

    // Calculate total price
    let Total_price = 0;
    if (selectedRoom) {
        const totalBeforeDiscount = basePrice * numberOfNights;
        const discountAmount = (totalBeforeDiscount * discountPercent) / 100;
        Total_price = totalBeforeDiscount - discountAmount;
    }

    updateBooking.Total_price = Total_price;

    // Update room availability based on booking status
    if (name === 'Status' && selectedRoom) {
        const updatedRooms = rooms.map(room => {
            if (room.Room_number?.toString() === updateBooking.Room_number?.toString()) {
                return {
                    ...room,
                    Status: value === 'Check_In' ? 'Unavailable' : 'Available'
                };
            }
            return room;
        });
        setRooms(updatedRooms);
    }

    setSelectedBooking(updateBooking);
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
        label="Customer Name"
      >
        <MenuItem value="Customer_name">Customer Name</MenuItem>
        <MenuItem value="Room_number">Room Number</MenuItem>
        <MenuItem value="Booking_date">Booking Date</MenuItem>
      </TextField>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

        <Button 
            variant="contained"
            color="primary"
            className="primary-button"
            startIcon={<AddIcon />} 
            onClick={handleAdd}> 
            Add New Booking
        </Button>  
      </Box>

  
    
      <div className="booking-table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow >
              <TableCell><b>SL No.</b></TableCell>
              <TableCell><b>Customer Name</b></TableCell>
              <TableCell><b>Room Number</b></TableCell>
              <TableCell><b>Booking Date</b></TableCell>
              <TableCell><b>Total Price</b></TableCell>
              <TableCell><b>Check-In</b></TableCell>
              <TableCell><b>Check-Out</b></TableCell>
              <TableCell><b>Payment Status</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooking.map((booking, index) => (
              <TableRow key={booking.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{booking.Customer_name}</TableCell>
                <TableCell>{booking.Room_number}</TableCell>
                <TableCell>{booking.Booking_date}</TableCell>
                <TableCell>₹{booking.Total_price}</TableCell>
                <TableCell>{booking.Check_in}</TableCell>
                <TableCell>{booking.Check_out}</TableCell>
                <TableCell>{booking.Payment_status}</TableCell>
                <TableCell>{booking.Status}</TableCell>
                <TableCell className='Action-btn'>
                  <IconButton onClick={() => handleView(booking)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(booking)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(booking._id)} color="error">
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
          {isEditing ? 'Edit Booking' : 'Add New Booking'}
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
              name="Customer_name"
              label="Customer Name"
              value={selectedBooking?.Customer_name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="Room_number"
              label="Room Number"
              value={selectedBooking?.Room_number || ''}
              onChange={handleChange}
              fullWidth
              select
              margin="normal"
            >
              {rooms
              .filter((room) => room.Status === "Available" || room.Room_number?.toString() === selectedBooking?.Room_number?.toString())
              .map((room) => (<MenuItem key={room._id} value={room.Room_number}>{room.Room_number}
              </MenuItem>
              ))}
            </TextField>
                
            <TextField
              name="Booking_date"
              label="Booking Date"
              value={selectedBooking?.Booking_date || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{shrink: true,
              }}
            />

            <TextField
              name="Total_price"
              label="Total Price"
              value={selectedBooking?.Total_price || ''}
              type="number"
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
                
            <TextField
              name="Check_in"
              label="Check-In"
              value={selectedBooking?.Check_in || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="Check_out"
              label="Check-Out"
              value={selectedBooking?.Check_out || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              rows={2}
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="Discount_code"
              label="Discount Code"
              value={selectedBooking?.Discount_code || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              select
            >

            {discounts
            .filter((discount) => discount.Status === "Active")
            .map((discount) => (
            <MenuItem key={discount._id} value={discount.Discount_code}>
              {discount.Discount_code}
             </MenuItem>
            ))}
            
            </TextField>

            <TextField
              name="Payment_status"
              label="Payment Status"
              value={selectedBooking?.Payment_status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
            </TextField>

            <TextField
              name="Status"
              label="Status"
              value={selectedBooking?.Status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Check_in">Check In</MenuItem>
              <MenuItem value="Check_out">Check Out</MenuItem>
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
          Booking Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 5, top: 5}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box className="view-details">
              <div><strong>Customer Name :</strong> {selectedBooking.Customer_name}</div>
              <div><strong>Room Number :</strong> {selectedBooking.Room_number}</div>
              <div><strong>Booking Date :</strong> {selectedBooking.Booking_date}</div>
              <div><strong>Total Price :</strong> ₹{selectedBooking.Total_price}</div>
              <div><strong>Check-In :</strong> {selectedBooking.Check_in}</div>
              <div><strong>Check-Out :</strong> {selectedBooking.Check_out}</div>
              <div><strong>Payment Status :</strong> {selectedBooking.Payment_status}</div>
              <div><strong>Status :</strong> {selectedBooking.Status}</div>
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

export default BookingTable;
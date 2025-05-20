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



const GuestTable = () => {
  const [guests, setGuests] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuest, setFilteredGuest] = useState([]);
  const [searchField, setSearchField] = useState();
  
  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/guest";

  // Fetch Branches from API
  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-guest`);
      console.log("Fetching guests - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.guest)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setGuests([]);
        return;
      }

      const guestData = response.data.guest;
      console.log("Processed guest data:", guestData);

      if (guestData.length === 0) {
        console.log("No guests found in the response");
      }

      setGuests(guestData);
    } catch (error) {
      console.error("Error fetching guest details:", error);
      toast.error(error.response?.data?.message || "Error loading guest details");
      setGuests([]);
    }
  };

  useEffect(() => {
    console.log("Initiating guests data fetch...");
    fetchGuests();
  }, []);

  //add serach effect
  useEffect(() => {
   if(!searchTerm){
    setFilteredGuest(guests);
    return;
   }

   const filtered = guests.filter((guest) =>{
    if(!guest[searchField]) return false;
    return guest[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
   });

   setFilteredGuest(filtered);
  },[searchTerm, searchField, guests]);

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedGuest(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedGuest({
      id: '',
      Booking_id: '',
      Guest_name: '',
      Guest_email: '',
      Guest_phone: '',
      Guest_address: '',
      Status:'',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (guest) => {
    setSelectedGuest(guest);
    setIsEditing(true);
    setOpen(true);
  };
  

  const handleView = (guest) => {
    setSelectedGuest(guest);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-guest/${id}`)
      .then(() => {
        toast.success("Guest deleted successfully");
        fetchGuests();
      })
      .catch(error => {
        console.error("Error deleting guest:", error);
        toast.error("Failed to delete guest");
      });
  };
  
  

  const handleSave = () => {
    if (!selectedGuest) return;

    console.log("Saving Guest:", selectedGuest);

    if (isEditing) {
        if (!selectedGuest._id) {
            console.error("Guest ID is missing!");
            toast.error("Guest ID is missing!");
            return;
        }

        axios.put(`${API_BASE_URL}/update-guest/${selectedGuest._id}`, selectedGuest)
            .then(response => {
                console.log("Updated Guest:", response.data);
                toast.success("Guest updated successfully");
                handleClose();
                fetchGuests();
            })
            .catch(error => {
                console.error("Error updating guest:", error);
                toast.error("Failed to update guest");
            });
    } else {
        axios.post(`${API_BASE_URL}/add-guest`, selectedGuest)
            .then(response => {
                console.log("Added Guest:", response.data);
                toast.success("Guest added successfully");
                handleClose();
                fetchGuests();
            })
            .catch(error => {
                console.error("Error adding guest:", error);
                toast.error("Failed to add guest");
            });
    }
  };

  const handleChange = (e) => {
    setSelectedGuest({
      ...selectedGuest,
      [e.target.name]: e.target.value,
    });
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
        label="Guest Name"
      >
        <MenuItem value="Guest_name">Guest Name</MenuItem>
        <MenuItem value="Guest_phone">Guest Phone Number</MenuItem>
        <MenuItem value="Guest_address">Guest Address</MenuItem>
      </TextField>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

        <Button 
            variant="contained"
            color="primary"
            className="primary-button"
            startIcon={<AddIcon />} 
            onClick={handleAdd}>
            Add New Guest
        </Button>  
      </Box>

  
    
      <div className="guset-table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow >
              <TableCell><b>SL No.</b></TableCell>
              <TableCell><b>Room Number</b></TableCell>
              <TableCell><b>Guest Name</b></TableCell>
              <TableCell><b>Guest Email</b></TableCell>
              <TableCell><b>Guest Phone</b></TableCell>
              <TableCell><b>Guest Address</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuest.map((guest, index) => (
              <TableRow key={guest.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{guest.Booking_id}</TableCell>
                <TableCell>{guest.Guest_name}</TableCell>
                <TableCell>{guest.Guest_email}</TableCell>
                <TableCell>{guest.Guest_phone}</TableCell>
                <TableCell>{guest.Guest_address}</TableCell>
                <TableCell>{guest.Status}</TableCell>
                <TableCell className='Action-btn'>
                  <IconButton onClick={() => handleView(guest)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(guest)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(guest._id)} color="error">
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
          {isEditing ? 'Edit Guest' : 'Add New Guest'}
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
              name="Booking_id"
              label="Room Number"
              value={selectedGuest?.Booking_id || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />

            <TextField
              name="Guest_name"
              label="Guest Name"
              value={selectedGuest?.Guest_name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            
            <TextField
              name="Guest_email"
              label="Guest Email"
              value={selectedGuest?.Guest_email || ''}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
            />
              
            <TextField
              name="Guest_phone"
              label="Guest Phone"
              value={selectedGuest?.Guest_phone || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />

            <TextField
              name="Guest_address"
              label="Guest Address"
              value={selectedGuest?.Guest_address || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              name="Status"
              label="Status"
              value={selectedGuest?.Status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
                <MenuItem value="Check_Out">Check_Out</MenuItem>
                <MenuItem value="Check_In">Check_In</MenuItem>
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
          Guest Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 5, top: 5}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedGuest && (
            <Box className="view-details">
              <div><strong>Room Number :</strong> {selectedGuest.Booking_id}</div>
              <div><strong>Guest Name :</strong> {selectedGuest.Guest_name}</div>
              <div><strong>Guest Email :</strong> {selectedGuest.Guest_email}</div>
              <div><strong>Guest Phone :</strong> {selectedGuest.Guest_phone}</div>
              <div><strong>Guest Address :</strong> {selectedGuest.Guest_address}</div>
              <div><strong>Status :</strong> {selectedGuest.Status}</div>
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

export default GuestTable;
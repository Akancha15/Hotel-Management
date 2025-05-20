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
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


const StaffTable = () => {
  const [staffs, setStaffs] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchField, setSearchField] = useState();
  
  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/staff";

  // Fetch Branches from API
  const fetchStaffs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-staff`);
      console.log("Fetching staffs - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.staff)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setStaffs([]);
        return;
      }

      const staffData = response.data.staff;
      console.log("Processed staff data:", staffData);

      if (staffData.length === 0) {
        console.log("No staffs found in the response");
      }

      setStaffs(staffData);
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast.error(error.response?.data?.message || "Error loading staff details");
      setStaffs([]);
    }
  };

  useEffect(() => {
    console.log("Initiating staffs data fetch...");
    fetchStaffs();
  }, []);
  
  //add serach effect
  useEffect(() => {
   if(!searchTerm){
    setFilteredStaff(staffs);
    return;
   }

   const filtered = staffs.filter((staff) =>{
    if(!staff[searchField]) return false;
    return staff[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
   });

   setFilteredStaff(filtered);
  },[searchTerm, searchField, staffs]);

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedStaff(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedStaff({
      id: '',
      Name: '',
      Email: '',
      Mobile_number: '',
      Address: '',
      Role: '',
      Salary: '',
      Joining_date:'',
      Status:'',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(true);
    setOpen(true);
  };
  

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-staff/${id}`)
      .then(() => {
        toast.success("Staff deleted successfully");
        fetchStaffs();
      })
      .catch(error => {
        console.error("Error deleting Staff:", error);
        toast.error("Failed to delete Staff");
      });
  };
  
  

  const handleSave = () => {
    if (!selectedStaff) return;

    console.log("Saving Staff:", selectedStaff);

    if (isEditing) {
        if (!selectedStaff._id) {
            console.error("Staff ID is missing!");
            toast.error("Staff ID is missing!");
            return;
        }

        axios.put(`${API_BASE_URL}/update-staff/${selectedStaff._id}`, selectedStaff)
            .then(response => {
                console.log("Updated Staff:", response.data);
                toast.success("Staff updated successfully");
                handleClose();
                fetchStaffs();
            })
            .catch(error => {
                console.error("Error updating Staff:", error);
                toast.error("Failed to update Staff");
            });
    } else {
        axios.post(`${API_BASE_URL}/add-staff`, selectedStaff)
            .then(response => {
                console.log("Added Staff:", response.data);
                toast.success("Staff added successfully");
                handleClose();
                fetchStaffs();
            })
            .catch(error => {
                console.error("Error adding Staff:", error);
                toast.error("Failed to add Staff");
            });
    }
  };

  const handleChange = (e) => {
    setSelectedStaff({
      ...selectedStaff,
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
        label="Name"
      >
        <MenuItem value="Name">Name</MenuItem>
        <MenuItem value="Mobile_number">Mobile_number</MenuItem>
        <MenuItem value="Role">Role</MenuItem>
      </TextField>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

        <Button 
            variant="contained"
            color="primary"
            className="primary-button"
            startIcon={<AddIcon />} 
            onClick={handleAdd}> 
            Add New Staff
        </Button>  
      </Box>

  
    
      <div className="Staff-table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow >
              <TableCell><b>SL No.</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Mobile Number</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell><b>Salary</b></TableCell>
              <TableCell><b>Joining-Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff.map((staff, index) => (
              <TableRow key={staff.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{staff.Name}</TableCell>
                <TableCell>{staff.Email}</TableCell>
                <TableCell>{staff.Mobile_number}</TableCell>
                <TableCell>{staff.Address}</TableCell>
                <TableCell>{staff.Role}</TableCell>
                <TableCell>{staff.Salary}</TableCell>
                <TableCell>{staff.Joining_date}</TableCell>
                <TableCell>{staff.Status}</TableCell>
                <TableCell className='Action-btn'>
                  <IconButton onClick={() => handleView(staff)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(staff)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(staff._id)} color="error">
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
          {isEditing ? 'Edit Staff' : 'Add New Staff'}
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
              name="Name"
              label="Name"
              value={selectedStaff?.Name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="Email"
              label="Email"
              value={selectedStaff?.Email || ''}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
            />

            <TextField
              name="Mobile_number"
              label="Mobile Number"
              value={selectedStaff?.Mobile_number || ''}
              onChange={handleChange}
              type="tel"
              fullWidth
              margin="normal"
            />
              
            <TextField
              name="Address"
              label="Address"
              value={selectedStaff?.Address || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="Role"
              label="Role"
              value={selectedStaff?.Role || ''}
              onChange={handleChange}
              fullWidth
              select
              margin="normal"
              rows={2}
            >
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Receptionist">Receptionist</MenuItem>
                <MenuItem value="HouseKeeping">HouseKeeping</MenuItem>
                <MenuItem value="Chef">Chef</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
            </TextField>


            <TextField
              name="Salary"
              label="Salary"
              value={selectedStaff?.Salary || ''}
              onChange={handleChange}
              fullWidth
              type='number'
              margin="normal"
            />
            
            <TextField
              name="Joining_date"
              label="Joining-Date"
              value={selectedStaff?.Joining_date || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
           
            <TextField
              name="Status"
              label="Status"
              value={selectedStaff?.Status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
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
          Staff Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 5, top: 5}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Box className="view-details">
              <div><strong>Name :</strong> {selectedStaff.Name}</div>
              <div><strong>Email :</strong> {selectedStaff.Email}</div>
              <div><strong>Mobile Number :</strong> {selectedStaff.Mobile_number}</div>
              <div><strong>Address :</strong> {selectedStaff.Address}</div>
              <div><strong>Role :</strong> {selectedStaff.Role}</div>
              <div><strong>Salary :</strong> {selectedStaff.Salary}</div>
              <div><strong>Joining-Date :</strong> {selectedStaff.Joining_date}</div>
              <div><strong>Status :</strong> {selectedStaff.Status}</div>
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

export default StaffTable;
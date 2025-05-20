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


const DiscountTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDiscount, setFilteredDiscount] = useState([]);
  const [searchField, setSearchField] = useState();

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/discount";

  // Function to check and update discount status based on dates
  const checkDiscountStatus = (discount) => {
    const today = new Date();
    const validFrom = new Date(discount.Valid_from);
    const validTo = new Date(discount.Valid_to);

    // Remove time part for date comparison
    today.setHours(0, 0, 0, 0);
    validFrom.setHours(0, 0, 0, 0);
    validTo.setHours(0, 0, 0, 0);

    if (today < validFrom) {
      return 'Upcoming';
    } else if (today > validTo) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  // Function to update discount status
  const updateDiscountStatus = async (discount) => {
    const newStatus = checkDiscountStatus(discount);
    if (newStatus !== discount.Status) {
      try {
        await axios.put(`${API_BASE_URL}/update-discount/${discount._id}`, {
          ...discount,
          Status: newStatus
        });
      } catch (error) {
        console.error("Error updating discount status:", error);
      }
    }
    return {
      ...discount,
      Status: newStatus
    };
  };

  // Fetch Discounts from API
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-alldiscount`);
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

      // Update status for each discount
      const updatedDiscounts = await Promise.all(
        discountData.map(updateDiscountStatus)
      );

      setDiscounts(updatedDiscounts);
      setFilteredDiscount(updatedDiscounts);
    } catch (error) {
      console.error("Error fetching discount details:", error);
      toast.error(error.response?.data?.message || "Error loading discount details");
      setDiscounts([]);
      setFilteredDiscount([]);
    }
  };

  useEffect(() => {
    console.log("Initiating discounts data fetch...");
    fetchDiscounts();
    
    // Set up interval to check discount status every day
    const interval = setInterval(() => {
      fetchDiscounts();
    }, 24 * 60 * 60 * 1000); // Check every 24 hours

    return () => clearInterval(interval);
  }, []);
  
  //add serach effect
  useEffect(() => {
   if(!searchTerm){
    setFilteredDiscount(discounts);
    return;
   }

   const filtered = discounts.filter((discount) =>{
    if(!discount[searchField]) return false;
    return discount[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
   });

   setFilteredDiscount(filtered);
  },[searchTerm, searchField, discounts]);

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedDiscount(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedDiscount({
      id: '',
      Discount_code: '',
      Discount_description: '',
      Discount_value: '',
      Valid_from: '',
      Valid_to: '',
      Status:'',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setIsEditing(true);
    setOpen(true);
  };
  

  const handleView = (discount) => {
    setSelectedDiscount(discount);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-discount/${id}`)
      .then(() => {
        toast.success("Discount deleted successfully");
        fetchDiscounts();
      })
      .catch(error => {
        console.error("Error deleting Discount:", error);
        toast.error("Failed to delete Discount");
      });
  };
  
  

  const handleSave = () => {
    if (!selectedDiscount) return;

    console.log("Saving Discount:", selectedDiscount);

    if (isEditing) {
        if (!selectedDiscount._id) {
            console.error("Discount ID is missing!");
            toast.error("Discount ID is missing!");
            return;
        }

        axios.put(`${API_BASE_URL}/update-discount/${selectedDiscount._id}`, selectedDiscount)
            .then(response => {
                console.log("Updated Discount:", response.data);
                toast.success("Discount updated successfully");
                handleClose();
                fetchDiscounts();
            })
            .catch(error => {
                console.error("Error updating Discount:", error);
                toast.error("Failed to update Discount");
            });
    } else {
        axios.post(`${API_BASE_URL}/add-discount`, selectedDiscount)
            .then(response => {
                console.log("Added Discount:", response.data);
                toast.success("Discount added successfully");
                handleClose();
                fetchDiscounts();
            })
            .catch(error => {
                console.error("Error adding Discount:", error);
                toast.error("Failed to add Discount");
            });
    }
  };

  const handleChange = (e) => {
    setSelectedDiscount({
      ...selectedDiscount,
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
        label="Discount Code"
      >
        <MenuItem value="Discount_code">Discount Code</MenuItem>
        <MenuItem value="Discount_value">Discount Value</MenuItem>
        <MenuItem value="Valid_from">Valid-From</MenuItem>
        <MenuItem value="Valid_to">Valid-To</MenuItem>
        <MenuItem value="Status">Status</MenuItem>
      </TextField>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

        <Button 
            variant="contained"
            color="primary"
            className="primary-button"
            startIcon={<AddIcon />} 
            onClick={handleAdd}> 
            Add New Discount
        </Button>  
      </Box>

  
    
      <div className="discount-table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow >
              <TableCell><b>SL No.</b></TableCell>
              <TableCell><b>Discount Code</b></TableCell>
              <TableCell><b>Discount Description</b></TableCell>
              <TableCell><b>Discount Value</b></TableCell>
              <TableCell><b>Valid-From</b></TableCell>
              <TableCell><b>Valid-To</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDiscount.map((discount, index) => (
              <TableRow key={discount.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{discount.Discount_code}</TableCell>
                <TableCell>{discount.Discount_description}</TableCell>
                <TableCell>{discount.Discount_value}</TableCell>
                <TableCell>{discount.Valid_from}</TableCell>
                <TableCell>{discount.Valid_to}</TableCell>
                <TableCell>{discount.Status}</TableCell>
                <TableCell className='Action-btn'>
                  <IconButton onClick={() => handleView(discount)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(discount)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(discount._id)} color="error">
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
          {isEditing ? 'Edit Discount' : 'Add New Discount'}
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
              name="Discount_code"
              label="Discount Code"
              value={selectedDiscount?.Discount_code || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="Discount_description"
              label="Discount Description"
              value={selectedDiscount?.Discount_description || ''}
              onChange={handleChange}
              fullWidth
              multiline
              margin="normal"
            />
                
            <TextField
              name="Discount_value"
              label="Discount Value"
              value={selectedDiscount?.Discount_value || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
              
            <TextField
              name="Valid_from"
              label="Valid-From"
              value={selectedDiscount?.Valid_from || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="Valid_to"
              label="Valid-To"
              value={selectedDiscount?.Valid_to || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              rows={2}
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="Status"
              label="Status"
              value={selectedDiscount?.Status || ''}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
              
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
          Discount Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 5, top: 5}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDiscount && (
            <Box className="view-details">
              <div><strong>Discount Code :</strong> {selectedDiscount.Discount_code}</div>
              <div><strong>Discount Description :</strong> {selectedDiscount.Discount_description}</div>
              <div><strong>Discount Value :</strong> {selectedDiscount.Discount_value}</div>
              <div><strong>Valid-From :</strong> {selectedDiscount.Valid_from}</div>
              <div><strong>Valid-To :</strong> {selectedDiscount.Valid_to}</div>
              <div><strong>Status :</strong> {selectedDiscount.Status}</div>
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

export default DiscountTable;
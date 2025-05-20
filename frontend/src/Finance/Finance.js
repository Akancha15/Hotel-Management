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



const FinanceTable = () => {
  const [finances, setFinances] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFinance, setFilteredFinance] = useState([]);
  const [searchField, setSearchField] = useState();
  
  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/finance";

  // Fetch Branches from API
  const fetchFinances = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-finance`);
      console.log("Fetching finances - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.finance)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setFinances([]);
        return;
      }

      const financeData = response.data.finance;
      console.log("Processed finance data:", financeData);

      if (financeData.length === 0) {
        console.log("No finances found in the response");
      }

      setFinances(financeData);
    } catch (error) {
      console.error("Error fetching finance details:", error);
      toast.error(error.response?.data?.message || "Error loading finance details");
      setFinances([]);
    }
  };

  useEffect(() => {
    console.log("Initiating finances data fetch...");
    fetchFinances();
  }, []);
  
  //add serach effect
  useEffect(() => {
   if(!searchTerm){
    setFilteredFinance(finances);
    return;
   }

   const filtered = finances.filter((finance) =>{
    if(!finance[searchField]) return false;
    return finance[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
   });

   setFilteredFinance(filtered);
  },[searchTerm, searchField, finances]);

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedFinance(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedFinance({
      id: '',
      Name: '',
      Amount: '',
      Transaction_type: '',
      Category: '',
      Payment_mode: '',
      Transaction_ondate: '',
      Status:'',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (finance) => {
    setSelectedFinance(finance);
    setIsEditing(true);
    setOpen(true);
  };
  

  const handleView = (finance) => {
    setSelectedFinance(finance);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-finance/${id}`)
      .then(() => {
        toast.success("Finance deleted successfully");
        fetchFinances();
      })
      .catch(error => {
        console.error("Error deleting Finance:", error);
        toast.error("Failed to delete Finance");
      });
  };
  
  

  const handleSave = () => {
    if (!selectedFinance) return;

    console.log("Saving Finance:", selectedFinance);

    if (isEditing) {
        if (!selectedFinance._id) {
            console.error("Guest ID is missing!");
            toast.error("Guest ID is missing!");
            return;
        }

        axios.put(`${API_BASE_URL}/update-finance/${selectedFinance._id}`, selectedFinance)
            .then(response => {
                console.log("Updated Finance:", response.data);
                toast.success("Finance updated successfully");
                handleClose();
                fetchFinances();
            })
            .catch(error => {
                console.error("Error updating Finance:", error);
                toast.error("Failed to update Finance");
            });
    } else {
        axios.post(`${API_BASE_URL}/add-finance`, selectedFinance)
            .then(response => {
                console.log("Added Finance:", response.data);
                toast.success("Finance added successfully");
                handleClose();
                fetchFinances();
            })
            .catch(error => {
                console.error("Error adding Finance:", error);
                toast.error("Failed to add Finance");
            });
    }
  };

  const handleChange = (e) => {
    setSelectedFinance({
      ...selectedFinance,
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
        label="Transaction Type"
      >
        <MenuItem value="Name">Name</MenuItem>
        <MenuItem value="Transaction_type">Transaction Type</MenuItem>
        <MenuItem value="Category">Category</MenuItem>
        <MenuItem value="Payment_mode">Payment Mode</MenuItem>
        <MenuItem value="Transaction_ondate">Transaction-On-Date</MenuItem>
      </TextField>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

        <Button 
            variant="contained"
            color="primary"
            className="primary-button"
            startIcon={<AddIcon />} 
            onClick={handleAdd}> 
            Add New Finance
        </Button>  
      </Box>

  
    
      <div className="finance-table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow >
              <TableCell><b>SL No.</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Transaction Type</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Payment Mode</b></TableCell>
              <TableCell><b>Transaction-On-Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFinance.map((finance, index) => (
              <TableRow key={finance.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{finance.Name}</TableCell>
                <TableCell>{finance.Amount}</TableCell>
                <TableCell>{finance.Transaction_type}</TableCell>
                <TableCell>{finance.Category}</TableCell>
                <TableCell>{finance.Payment_mode}</TableCell>
                <TableCell>{finance.Transaction_ondate}</TableCell>
                <TableCell>{finance.Status}</TableCell>
                <TableCell className='Action-btn'>
                  <IconButton onClick={() => handleView(finance)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(finance)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(finance._id)} color="error">
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
          {isEditing ? 'Edit Finance' : 'Add New Finance'}
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
              value={selectedFinance?.Name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="Amount"
              label="Amount"
              value={selectedFinance?.Amount || ''}
              type='number'
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            
            <TextField
              name="Transaction_type"
              label="Transaction Type"
              value={selectedFinance?.Transaction_type || ''}
              onChange={handleChange}
              fullWidth
              select
              margin="normal"
            >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expenses">Expenses</MenuItem>
            </TextField>
              
            <TextField
              name="Category"
              label="Category"
              value={selectedFinance?.Category || ''}
              onChange={handleChange}
              fullWidth
              select
              margin="normal"
            >
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Payment">Payment</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
            </TextField>

            <TextField
              name="Payment_mode"
              label="Payment Mode"
              value={selectedFinance?.Payment_mode || ''}
              onChange={handleChange}
              fullWidth
              select
              margin="normal"
              rows={2}
            >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
            </TextField>

            <TextField
              name="Transaction_ondate"
              label="Transaction-On-Date"
              value={selectedFinance?.Transaction_ondate || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="Status"
              label="Status"
              value={selectedFinance?.Status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
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
          Finance Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 5, top: 5}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedFinance && (
            <Box className="view-details">
              <div><strong>Name :</strong> {selectedFinance.Name}</div>
              <div><strong>Amount :</strong> {selectedFinance.Amount}</div>
              <div><strong>Transaction Type :</strong> {selectedFinance.Transaction_type}</div>
              <div><strong>Category :</strong> {selectedFinance.Category}</div>
              <div><strong>PaymentMode :</strong> {selectedFinance.Payment_mode}</div>
              <div><strong>Transaction-On-Date :</strong> {selectedFinance.Transaction_ondate}</div>
              <div><strong>Status :</strong> {selectedFinance.Status}</div>
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

export default FinanceTable;
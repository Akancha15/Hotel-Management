import React, { useState } from "react";
import { Button, Modal, Box, Select, MenuItem } from "@mui/material";

const AddButton = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleStatusChange = (event) => setStatus(event.target.value);

  return (
    <div>
      <Button variant="contained" color="primary"  onClick={handleOpen}>
        Add New Row
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
          }}
        >

          <form>
          <h2>Add Room</h2>
          
          
            <label><b>Room Number</b></label>
            <input type="number" fullWidth style={{ display: "inline", marginBottom: "16px", width: "100%",  height: "30px", marginTop: "8px" }} />
            
            <label><b>Room Type</b></label>
            <input type="text" fullWidth style={{ display: "inline", marginBottom: "16px", width: "100%", height: "30px", marginTop: "8px" }} />

            <label><b>Price</b></label>
            <input type="number" fullWidth style={{ display: "inline", marginBottom: "16px", width: "100%", height: "30px", marginTop: "8px"  }} />

            <label><b>Bed Type</b></label>
            <input type="text" fullWidth style={{ display: "inline", marginBottom: "16px", width: "100%", height: "30px", marginTop: "8px"  }} />

            <label><b>Status</b></label>
            <Select
              value={status}
              onChange={handleStatusChange}
              displayEmpty
              style={{ marginBottom: "16px", width: "100%", height: "40px" , marginTop: "8px" }}
            >
              <MenuItem value="" disabled>Select Status</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
              <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
            </Select>

            <label><b>Capacity</b></label>
            <input type="number" fullWidth style={{ display: "block", marginBottom: "16px", width: "100%", height: "30px", marginTop: "8px"  }} />

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddButton;

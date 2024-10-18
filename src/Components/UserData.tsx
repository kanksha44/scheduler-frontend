import React, { useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface FormData {
  name: string;
  phonenumber: string;
  smstosend: string;
  date: string;
  time: Dayjs | null;
}

const UserList: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phonenumber: "",
    smstosend: "",
    date: "",
    time: null,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeChange = (newValue: Dayjs | null) => {
    setFormData((prevData) => ({
      ...prevData,
      time: newValue,
    }));
  };

  const handleSubmit = async () => {
    const time = formData.time ? formData.time.format("HH:mm") : "";
    try {
      const response = await axios.post(
        "http://localhost:8000/api/scheduleSms",
        {
          name: formData.name,
          phonenumber: formData.phonenumber,
          smstosend: formData.smstosend,
          date: formData.date,
          time: time,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Show success message
      setSnackbarMessage("SMS scheduled successfully!");
      setOpenSnackbar(true);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending form data:", error);
      setSnackbarMessage("Error scheduling SMS. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper sx={{ padding: 3, margin: "20px", maxWidth: 600 }} elevation={3}>
      <Typography variant="h4" component="h2" gutterBottom>
        Schedule SMS
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            type="tel"
            variant="outlined"
            fullWidth
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="SMS to Send"
            variant="outlined"
            fullWidth
            name="smstosend"
            value={formData.smstosend}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Time"
              value={formData.time}
              onChange={handleTimeChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Schedule SMS
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserList;

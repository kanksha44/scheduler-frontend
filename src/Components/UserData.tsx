import React, { useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Button } from "@mui/material";
import { Stack } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import{ Dayjs } from "dayjs"; 
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


interface FormData {
  name: string;
  phonenumber: string;
  smstosend: string;
  date: string;
  // time: string;
  time: Dayjs | null;
}

const UserList: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phonenumber: "",
    smstosend: "",
    date: "",
    // time: "",
    time: null,
  });

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
    console.log("Form Submitted", formData);
    const time = formData.time ? formData.time.format("HH:mm") : "";
    try {
      const response = await axios.post(
        "http://localhost:8000/api/scheduleSms",
       {formData,time},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }} direction="row">
      <Stack>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Stack>

      <Stack>
        <TextField
          label="phonenumber"
          type="tel"
          variant="outlined"
          fullWidth
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
        />
      </Stack>

      <Stack>
        <TextField
          label="SMS to send"
          variant="outlined"
          fullWidth
          name="smstosend"
          value={formData.smstosend}
          onChange={handleChange}
        />
      </Stack>

      <Stack>
        <TextField
          type="date"
          variant="outlined"
          fullWidth
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Stack>

      <Stack>
        {/* <TextField 
            type="time" 
            variant="outlined" 
            fullWidth 
            name="time" 
            value={formData.time}
            onChange={handleChange}
            
          /> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>

<TimePicker
  label="Time"
  // value={formData.time ? dayjs(formData.time, "HH:mm") : null}
  value={formData.time}
  // onChange={(newValue) => {
  //   handleChange({
  //     name: "time",
  //     value: newValue ? newValue.format("HH:mm") : "",
  //   });
  // }}
  onChange={handleTimeChange}
/>
</LocalizationProvider>
      </Stack>

      <Stack>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Schedule SMS
        </Button>
      </Stack>
    </Stack>
  );
};

export default UserList;

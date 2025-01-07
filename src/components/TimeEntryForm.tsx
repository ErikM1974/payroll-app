import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { EmployeeTime, TimeEntryFormProps } from '../types';

const initialState: EmployeeTime = {
  Excel_Sheet_ID: '',
  Last_Name: '',
  First_Name: '',
  REG: 0,
  OT: 0,
  VACATION: 0,
  Holiday: 0,
  PTO: 0,
  Sick: 0,
  Deduct: 0,
  Commission: 0,
  ID_Record_Employee: '',
  Pay_Period: '',
  Today_Date: new Date().toISOString().split('T')[0],
  NOTE: ''
};

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EmployeeTime>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['REG', 'OT', 'VACATION', 'Holiday', 'PTO', 'Sick', 'Deduct', 'Commission'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Employee Time Entry
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Excel Sheet ID"
              name="Excel_Sheet_ID"
              value={formData.Excel_Sheet_ID}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="First_Name"
              value={formData.First_Name}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="Last_Name"
              value={formData.Last_Name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee Record ID"
              name="ID_Record_Employee"
              value={formData.ID_Record_Employee}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pay Period"
              name="Pay_Period"
              value={formData.Pay_Period}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Regular Hours"
              name="REG"
              value={formData.REG}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.25 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Overtime Hours"
              name="OT"
              value={formData.OT}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.25 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Vacation Hours"
              name="VACATION"
              value={formData.VACATION}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.25 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="PTO Hours"
              name="PTO"
              value={formData.PTO}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.25 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Holiday Hours"
              name="Holiday"
              value={formData.Holiday}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.25 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Sick Hours"
              name="Sick"
              value={formData.Sick}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.25 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Commission"
              name="Commission"
              value={formData.Commission}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Deduction"
              name="Deduct"
              value={formData.Deduct}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="NOTE"
              value={formData.NOTE}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Submit Entry
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TimeEntryForm;

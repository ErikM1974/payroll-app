import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TimeEntryForm from './components/TimeEntryForm';
import TimeTable from './components/TimeTable';
import { EmployeeTime } from './types';
import { PayrollAPI } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [entries, setEntries] = useState<EmployeeTime[]>([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await PayrollAPI.getTimeEntries();
      setEntries(response.Result);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (data: EmployeeTime) => {
    try {
      await PayrollAPI.createTimeEntry(data);
      fetchEntries(); // Refresh the list after creating
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleDelete = async (pkId: number) => {
    try {
      await PayrollAPI.deleteTimeEntry(pkId);
      fetchEntries(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleUpdate = async (pkId: number, updatedData: Partial<EmployeeTime>) => {
    try {
      await PayrollAPI.updateTimeEntry(pkId, updatedData);
      fetchEntries(); // Refresh the list after updating
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <h1>Payroll App</h1>
        <TimeEntryForm onSubmit={handleSubmit} />
        <TimeTable 
          entries={entries} 
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;

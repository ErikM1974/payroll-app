require('dotenv').config();
const axios = require('axios');

const CASPIO_API_KEY = process.env.REACT_APP_CASPIO_API_KEY;
const CASPIO_ACCOUNT_ID = process.env.REACT_APP_CASPIO_ACCOUNT_ID;

console.log('Using Account ID:', CASPIO_ACCOUNT_ID);
const BASE_URL = `https://${CASPIO_ACCOUNT_ID}.caspio.com/rest/v2`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `bearer ${CASPIO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Test reading records
async function testGetRecords() {
  try {
    const response = await api.get('/tables/Payroll_Bradley_API_2025/records');
    console.log('GET Response:', response.data);
  } catch (error) {
    console.error('GET Error:', error.response?.data || error.message);
  }
}

// Test creating a record
async function testCreateRecord() {
  const testData = {
    Excel_Sheet_ID: 'TEST123',
    Last_Name: 'Test',
    First_Name: 'User',
    REG: 40,
    OT: 5,
    VACATION: 0,
    Holiday: 8,
    PTO: 0,
    Sick: 0,
    Deduct: 0,
    Commission: 100,
    ID_Record_Employee: 'EMP123',
    Pay_Period: 'Pay 1',
    Today_Date: new Date().toISOString().split('T')[0]
  };

  try {
    const response = await api.post('/tables/Payroll_Bradley_API_2025/records', testData);
    console.log('POST Response:', response.data);
  } catch (error) {
    console.error('POST Error:', error.response?.data || error.message);
  }
}

// Run tests
console.log('Testing Caspio Integration...');
testGetRecords().then(() => testCreateRecord());

import axios from 'axios';
import { EmployeeTime, CaspioResponse } from '../types';

const CASPIO_API_KEY = process.env.REACT_APP_CASPIO_API_KEY;
const CASPIO_ACCOUNT_ID = process.env.REACT_APP_CASPIO_ACCOUNT_ID;
const BASE_URL = `https://${CASPIO_ACCOUNT_ID}.caspio.com/rest/v2`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `bearer ${CASPIO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const PayrollAPI = {
  async createTimeEntry(entry: EmployeeTime) {
    try {
      const response = await api.post('/tables/Payroll_Bradley_API_2025/records', {
        Excel_Sheet_ID: entry.Excel_Sheet_ID,
        Last_Name: entry.Last_Name,
        First_Name: entry.First_Name,
        REG: entry.REG,
        OT: entry.OT,
        VACATION: entry.VACATION,
        Holiday: entry.Holiday,
        PTO: entry.PTO,
        Sick: entry.Sick,
        Deduct: entry.Deduct,
        Commission: entry.Commission,
        ID_Record_Employee: entry.ID_Record_Employee,
        Pay_Period: entry.Pay_Period,
        Today_Date: entry.Today_Date,
        NOTE: entry.NOTE
      });
      // Caspio returns 201 Created with no body for successful POST
      return { Result: [] } as CaspioResponse<EmployeeTime>;
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  },

  async getTimeEntries() {
    try {
      const response = await api.get<CaspioResponse<EmployeeTime>>('/tables/Payroll_Bradley_API_2025/records');
      return response.data;
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    }
  },

  async getTimeEntriesByPayPeriod(payPeriod: string) {
    try {
      const response = await api.get<CaspioResponse<EmployeeTime>>(
        `/tables/Payroll_Bradley_API_2025/records?q.where=Pay_Period='${encodeURIComponent(payPeriod)}'`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching time entries by pay period:', error);
      throw error;
    }
  },

  async updateTimeEntry(pkId: number, entry: Partial<EmployeeTime>) {
    try {
      const response = await api.put(`/tables/Payroll_Bradley_API_2025/records?q.where=PK_ID=${pkId}`, entry);
      return response.status === 200;
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  },

  async deleteTimeEntry(pkId: number) {
    try {
      const response = await api.delete(`/tables/Payroll_Bradley_API_2025/records?q.where=PK_ID=${pkId}`);
      return response.status === 200;
    } catch (error) {
      console.error('Error deleting time entry:', error);
      throw error;
    }
  }
};

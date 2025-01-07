import axios from 'axios';
import { CASPIO_ACCOUNT_ID, BASE_URL } from './config';
import { EmployeeTime, CaspioResponse, Employee, PayPeriod } from '../types';

const ACCESS_TOKEN = 'H5FqS1rqL1eTTBh6672avZnNtPDdi3Ce1bPzNcSmE8zrVO4FPpKXLNbY9ckmb51HNl4jfjgkt5eKWbDLMBvBZ8TJeX6TDO0mmNh8-epSQba5Xu-zqMBeQ274VPzkuxXLYyo-fj_1wNDDu3yblU0Ypnh0gKNYk9w-GWxqQXSFieHoPDNppsEzV_hP-tyfYPPk2ZnV-e_cBEl5UIBVt-rcAbKE9s7gtEYwknzpqs7DrIV17MkwcQTODn24f-PHDFEFVIrrA5jAhxS3DYLqjqm5DbCdndIYi0smbNGxgqME1n7Vun3HfILl823NAtXk9ldAQVxOSsq1kAK6BBY50aopes2PUVSvzJoXPOmWO8l-3qTRSsEJZR8Di9u42aRagYgS_K9118b-j2YxyvHl5rw4vlLERqy91uSnSJMTQj_tJ-g';

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${ACCESS_TOKEN}`
      }
    });
  }

  async getEmployees(): Promise<CaspioResponse<Employee>> {
    try {
      const response = await this.api.get('/tables/Employees/records?q.limit=100');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id: string): Promise<CaspioResponse<Employee>> {
    try {
      const response = await this.api.get(
        `/tables/Employees/records?q.where=ID_Record_Employee='${encodeURIComponent(id)}'`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async getPayPeriods(): Promise<CaspioResponse<PayPeriod>> {
    try {
      const response = await this.api.get('/tables/Pay_Periods/records?q.sort=year,period_number');
      return response.data;
    } catch (error) {
      console.error('Error fetching pay periods:', error);
      throw error;
    }
  }

  async createPayPeriod(period: Omit<PayPeriod, 'PK_ID'>): Promise<boolean> {
    try {
      const response = await this.api.post('/tables/Pay_Periods/records', period);
      return response.status === 201;
    } catch (error) {
      console.error('Error creating pay period:', error);
      throw error;
    }
  }

  async updatePayPeriod(pkId: number, updates: Partial<PayPeriod>): Promise<boolean> {
    try {
      const response = await this.api.put(`/tables/Pay_Periods/records?q.where=PK_ID=${pkId}`, updates);
      return response.status === 200;
    } catch (error) {
      console.error('Error updating pay period:', error);
      throw error;
    }
  }

  async getCurrentPayPeriod(): Promise<CaspioResponse<PayPeriod>> {
    try {
      const response = await this.api.get('/tables/Pay_Periods/records?q.where=is_current=Yes');
      return response.data;
    } catch (error) {
      console.error('Error fetching current pay period:', error);
      throw error;
    }
  }

  async createTimeEntry(entry: Omit<EmployeeTime, 'PK_ID'>): Promise<CaspioResponse<EmployeeTime>> {
    try {
      const response = await this.api.post('/tables/Payroll_Bradley_API_2025/records', {
        pay_period_id: entry.pay_period_id,
        REG: entry.REG,
        OT: entry.OT,
        VACATION: entry.VACATION,
        Holiday: entry.Holiday,
        PTO: entry.PTO,
        Sick: entry.Sick,
        Deduct: entry.Deduct,
        Commission: entry.Commission,
        ID_Record_Employee: entry.ID_Record_Employee,
        Today_Date: entry.Today_Date,
        NOTE: entry.NOTE,
        status: entry.status
      });
      return { Result: [] };
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  }

  async getTimeEntries(): Promise<CaspioResponse<EmployeeTime>> {
    try {
      const response = await this.api.get('/tables/Payroll_Bradley_API_2025/records');
      return response.data;
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    }
  }

  async getTimeEntriesByPayPeriod(payPeriodId: number): Promise<CaspioResponse<EmployeeTime>> {
    try {
      const response = await this.api.get(
        `/tables/Payroll_Bradley_API_2025/records?q.where=pay_period_id=${payPeriodId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching time entries by pay period:', error);
      throw error;
    }
  }

  async updateTimeEntry(pkId: number, entry: Partial<EmployeeTime>): Promise<boolean> {
    try {
      const response = await this.api.put(`/tables/Payroll_Bradley_API_2025/records?q.where=PK_ID=${pkId}`, entry);
      return response.status === 200;
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  }

  async deleteTimeEntry(pkId: number): Promise<boolean> {
    try {
      const response = await this.api.delete(`/tables/Payroll_Bradley_API_2025/records?q.where=PK_ID=${pkId}`);
      return response.status === 200;
    } catch (error) {
      console.error('Error deleting time entry:', error);
      throw error;
    }
  }
}

export const PayrollAPI = new ApiService();

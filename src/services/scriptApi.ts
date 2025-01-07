import axios from 'axios';
import { CASPIO_ACCOUNT_ID, BASE_URL } from './config';

const ACCESS_TOKEN = 'H5FqS1rqL1eTTBh6672avZnNtPDdi3Ce1bPzNcSmE8zrVO4FPpKXLNbY9ckmb51HNl4jfjgkt5eKWbDLMBvBZ8TJeX6TDO0mmNh8-epSQba5Xu-zqMBeQ274VPzkuxXLYyo-fj_1wNDDu3yblU0Ypnh0gKNYk9w-GWxqQXSFieHoPDNppsEzV_hP-tyfYPPk2ZnV-e_cBEl5UIBVt-rcAbKE9s7gtEYwknzpqs7DrIV17MkwcQTODn24f-PHDFEFVIrrA5jAhxS3DYLqjqm5DbCdndIYi0smbNGxgqME1n7Vun3HfILl823NAtXk9ldAQVxOSsq1kAK6BBY50aopes2PUVSvzJoXPOmWO8l-3qTRSsEJZR8Di9u42aRagYgS_K9118b-j2YxyvHl5rw4vlLERqy91uSnSJMTQj_tJ-g';

class ScriptApiService {
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

  async getPayPeriods() {
    try {
      const response = await this.api.get('/tables/Pay_Periods/records?q.sort=year,period_number');
      return response.data;
    } catch (error) {
      console.error('Error fetching pay periods:', error);
      throw error;
    }
  }

  async createPayPeriod(period: any) {
    try {
      // Convert boolean to string for Caspio and ensure proper JSON formatting
      const payload = {
        period_number: period.period_number,
        year: period.year,
        start_date: period.start_date,
        end_date: period.end_date,
        status: period.status,
        is_current: period.is_current ? "Yes" : "No"
      };

      console.log('Creating pay period with payload:', JSON.stringify(payload, null, 2));

      // Send the payload directly without additional JSON.stringify
      const response = await this.api.post('/tables/Pay_Periods/records', payload);
      return response.status === 201;
    } catch (error) {
      console.error('Error creating pay period:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async updatePayPeriod(pkId: number, updates: any) {
    try {
      // Convert boolean to string for Caspio
      const payload = { ...updates };
      if ('is_current' in payload) {
        payload.is_current = payload.is_current ? "Yes" : "No";
      }

      const response = await this.api.put(`/tables/Pay_Periods/records?q.where=PK_ID=${pkId}`, payload);
      return response.status === 200;
    } catch (error) {
      console.error('Error updating pay period:', error);
      throw error;
    }
  }

  async getCurrentPayPeriod() {
    try {
      const response = await this.api.get('/tables/Pay_Periods/records?q.where=is_current=Yes');
      return response.data;
    } catch (error) {
      console.error('Error fetching current pay period:', error);
      throw error;
    }
  }
}

export const ScriptAPI = new ScriptApiService();

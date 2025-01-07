import axios from 'axios';
import { BASE_URL } from '../services/config';

const ACCESS_TOKEN = 'H5FqS1rqL1eTTBh6672avZnNtPDdi3Ce1bPzNcSmE8zrVO4FPpKXLNbY9ckmb51HNl4jfjgkt5eKWbDLMBvBZ8TJeX6TDO0mmNh8-epSQba5Xu-zqMBeQ274VPzkuxXLYyo-fj_1wNDDu3yblU0Ypnh0gKNYk9w-GWxqQXSFieHoPDNppsEzV_hP-tyfYPPk2ZnV-e_cBEl5UIBVt-rcAbKE9s7gtEYwknzpqs7DrIV17MkwcQTODn24f-PHDFEFVIrrA5jAhxS3DYLqjqm5DbCdndIYi0smbNGxgqME1n7Vun3HfILl823NAtXk9ldAQVxOSsq1kAK6BBY50aopes2PUVSvzJoXPOmWO8l-3qTRSsEJZR8Di9u42aRagYgS_K9118b-j2YxyvHl5rw4vlLERqy91uSnSJMTQj_tJ-g';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `bearer ${ACCESS_TOKEN}`
  }
});

async function createPayPeriodsTable() {
  try {
    console.log('Setting up Pay_Periods table...');

    // Check if table exists
    try {
      await api.get('/tables/Pay_Periods');
      console.log('Table already exists, proceeding with field setup...');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Table doesn't exist, create it
        console.log('Creating Pay_Periods table...');
        const createTableResponse = await api.post('/tables', {
          Name: "Pay_Periods",
          Description: "Stores bi-weekly pay periods"
        });

        if (createTableResponse.status !== 201) {
          throw new Error(`Failed to create table: ${createTableResponse.statusText}`);
        }
        console.log('Table created successfully');
      } else {
        throw error;
      }
    }

    // Add fields
    const fields = [
      {
        Name: "PK_ID",
        DataType: "AutoNumber",
        IsRequired: true,
        IsPrimaryKey: true
      },
      {
        Name: "period_number",
        DataType: "Number",
        IsRequired: true,
        Description: "1-26 for the year"
      },
      {
        Name: "year",
        DataType: "Number",
        IsRequired: true
      },
      {
        Name: "start_date",
        DataType: "DateTime",
        IsRequired: true
      },
      {
        Name: "end_date",
        DataType: "DateTime",
        IsRequired: true
      },
      {
        Name: "status",
        DataType: "String",
        IsRequired: true,
        Description: "open, processing, or closed"
      },
      {
        Name: "is_current",
        DataType: "String",
        IsRequired: true,
        DefaultValue: "No",
        Description: "Yes/No field"
      }
    ];

    for (const field of fields) {
      try {
        console.log(`Adding field: ${field.Name}`);
        console.log('Field payload:', JSON.stringify(field));
        const addFieldResponse = await api.post('/tables/Pay_Periods/fields', field);
        if (addFieldResponse.status === 201) {
          console.log(`Field ${field.Name} added successfully`);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data.Code === 'ObjectExists') {
          console.log(`Field ${field.Name} already exists, skipping...`);
        } else {
          console.error(`Error adding field ${field.Name}:`, error.response?.data);
          throw error;
        }
      }
    }

    // Add indexes
    const indexes = [
      {
        Name: "idx_year_period",
        Fields: ["year", "period_number"],
        IsUnique: true
      },
      {
        Name: "idx_dates",
        Fields: ["start_date", "end_date"],
        IsUnique: false
      }
    ];

    for (const index of indexes) {
      try {
        console.log(`Adding index: ${index.Name}`);
        console.log('Index payload:', JSON.stringify(index));
        const addIndexResponse = await api.post('/tables/Pay_Periods/indexes', index);
        if (addIndexResponse.status === 201) {
          console.log(`Index ${index.Name} added successfully`);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data.Code === 'ObjectExists') {
          console.log(`Index ${index.Name} already exists, skipping...`);
        } else {
          console.error(`Error adding index ${index.Name}:`, error.response?.data);
          throw error;
        }
      }
    }

    console.log('Pay_Periods table setup complete!');

  } catch (error) {
    console.error('Error setting up Pay_Periods table:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run the setup
createPayPeriodsTable()
  .then(() => console.log('Setup completed successfully'))
  .catch(error => console.error('Setup failed:', error));

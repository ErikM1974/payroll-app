import { PayrollAPI } from '../services/api';

/**
 * Creates or updates Caspio tables required for the payroll system
 */
async function setupCaspioTables() {
  try {
    console.log('Setting up Caspio tables...');

    // 1. Create Pay_Periods table
    const payPeriodsTableSchema = {
      "name": "Pay_Periods",
      "fields": [
        {
          "name": "PK_ID",
          "type": "AutoNumber",
          "required": true,
          "isPrimaryKey": true
        },
        {
          "name": "period_number",
          "type": "Number",
          "required": true,
          "description": "1-26 for the year"
        },
        {
          "name": "year",
          "type": "Number",
          "required": true
        },
        {
          "name": "start_date",
          "type": "Date",
          "required": true
        },
        {
          "name": "end_date",
          "type": "Date",
          "required": true
        },
        {
          "name": "status",
          "type": "Text",
          "required": true,
          "description": "open, processing, or closed"
        },
        {
          "name": "is_current",
          "type": "Boolean",
          "required": true,
          "defaultValue": false
        }
      ],
      "indexes": [
        {
          "name": "idx_year_period",
          "fields": ["year", "period_number"],
          "isUnique": true
        },
        {
          "name": "idx_dates",
          "fields": ["start_date", "end_date"]
        }
      ]
    };

    // 2. Update Payroll_Bradley_API_2025 table
    const timeEntryTableUpdates = {
      "addFields": [
        {
          "name": "pay_period_id",
          "type": "Number",
          "required": true,
          "description": "References Pay_Periods.PK_ID"
        },
        {
          "name": "status",
          "type": "Text",
          "required": true,
          "defaultValue": "pending",
          "description": "pending, approved, or processed"
        }
      ],
      "removeFields": [
        "Excel_Sheet_ID",
        "Pay_Period"
      ],
      "addIndexes": [
        {
          "name": "idx_pay_period",
          "fields": ["pay_period_id"]
        },
        {
          "name": "idx_employee_period",
          "fields": ["ID_Record_Employee", "pay_period_id"],
          "isUnique": true
        }
      ]
    };

    console.log(`
To set up the required Caspio tables, follow these steps:

1. Log into your Caspio account
2. Go to Tables section
3. Create a new table "Pay_Periods" with this schema:
${JSON.stringify(payPeriodsTableSchema, null, 2)}

4. Modify the existing "Payroll_Bradley_API_2025" table:
- Add these fields:
${JSON.stringify(timeEntryTableUpdates.addFields, null, 2)}

- Remove these fields:
${JSON.stringify(timeEntryTableUpdates.removeFields, null, 2)}

- Add these indexes:
${JSON.stringify(timeEntryTableUpdates.addIndexes, null, 2)}

5. After setting up the tables, run the initializePayPeriods script:
   npm run initialize-pay-periods

Important Notes:
- Back up your data before making these changes
- The pay_period_id in Payroll_Bradley_API_2025 should reference Pay_Periods.PK_ID
- Ensure all existing time entries are migrated to use the new pay_period_id field
- The status field in both tables uses predefined values (see descriptions)
`);

  } catch (error) {
    console.error('Error setting up Caspio tables:', error);
    throw error;
  }
}

// Run the setup
setupCaspioTables()
  .then(() => console.log('Setup instructions generated successfully'))
  .catch(error => console.error('Failed to generate setup instructions:', error));

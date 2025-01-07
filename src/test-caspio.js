// Test creating a field in Pay_Periods table
const fieldDefinition = {
  "Name": "PK_ID",
  "DataType": "AutoNumber",
  "IsRequired": true,
  "IsPrimaryKey": true
};

// Test creating an index in Pay_Periods table
const indexDefinition = {
  "Name": "idx_year_period",
  "Fields": ["year", "period_number"],
  "IsUnique": true
};

// For testing in Swagger UI:
// 1. POST /v2/tables/Pay_Periods/fields
// Request body: fieldDefinition

// 2. POST /v2/tables/Pay_Periods/indexes  
// Request body: indexDefinition

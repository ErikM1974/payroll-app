export interface Employee {
  PK_ID: number;
  ID_Record_Employee: string;
  First_Name: string;
  Last_Name: string;
  Job_Title: string;
  Role: string;
  Manager: string;
  Employee_Full_Name: string;
  Status: boolean;
  Vacation_Hours_Available: number;
  Vacation_Hours_Used: number;
  Vacation_Hours_Remaining: number;
  Sick_Accum_Hours_Available: number;
  Department: string;
  Address: string;
  City: string;
  State: string;
  Zip: string;
  Initials: string;
  Date_Hired: string;
  Review_Date: string;
  Birthday: string;
  Operator: boolean;
  Pay: number;
  Email_Employee_Login: string;
  Email_NWCA: string;
  Personal_Email: string;
  Employee_Cell_Phone: string;
  Emergency_Contact_Name: string;
  Emergency_Phone: string;
  Emergency_Notes: string;
  Nickname: string;
  Timestamp: string;
  admin_email: string;
  Full_Address: string;
  Full_Name_Formula: string;
  Photo_Employee: string;
}

export interface PayPeriod {
  PK_ID: number;
  period_number: number; // 1-26 for the year
  year: number;
  start_date: string;
  end_date: string;
  status: 'open' | 'processing' | 'closed'; // Match Caspio's schema
  is_current: boolean; // Boolean in schema, we'll convert to "Yes"/"No" in API
}

export interface EmployeeTime {
  PK_ID?: number;
  pay_period_id: number; // References PayPeriod.PK_ID
  ID_Record_Employee: string; // References Employee.ID_Record_Employee
  employee?: Employee; // Optional reference to full employee data
  REG: number;
  OT: number;
  VACATION: number;
  Holiday: number;
  PTO: number;
  Sick: number;
  Total?: number;
  Deduct: number;
  Commission: number;
  Today_Date: string;
  NOTE?: string;
  status: 'pending' | 'approved' | 'processed'; // Match Caspio's schema
}

export interface CaspioResponse<T> {
  Result: T[];
}

export interface TimeEntryFormProps {
  onSubmit: (data: EmployeeTime) => void;
}

export interface TimeTableProps {
  entries: EmployeeTime[];
  onDelete: (pkId: number) => Promise<void>;
  onUpdate: (pkId: number, updatedData: Partial<EmployeeTime>) => Promise<void>;
}

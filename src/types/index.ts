export interface EmployeeTime {
  PK_ID?: number;
  Excel_Sheet_ID: string;
  Payroll_Record_ID?: string;
  Last_Name: string;
  First_Name: string;
  REG: number;
  OT: number;
  VACATION: number;
  Holiday: number;
  PTO: number;
  Sick: number;
  Total?: number;
  Deduct: number;
  Commission: number;
  ID_Record_Employee: string;
  Pay_Period: string;
  Today_Date: string;
  NOTE?: string;
}

export interface CaspioResponse<T> {
  Result: T[];
}

export interface TimeEntryFormProps {
  onSubmit: (data: EmployeeTime) => void;
}

export interface TimeTableProps {
  entries: EmployeeTime[];
}

import React from 'react';
import { Button } from '@mui/material';
import { EmployeeTime } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface PDFGeneratorProps {
  entries: EmployeeTime[];
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ entries }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Payroll Time Sheet', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);

    // Calculate totals
    const totals = entries.reduce((acc, entry) => ({
      REG: acc.REG + entry.REG,
      OT: acc.OT + entry.OT,
      VACATION: acc.VACATION + entry.VACATION,
      PTO: acc.PTO + entry.PTO,
      Holiday: acc.Holiday + entry.Holiday,
      Sick: acc.Sick + entry.Sick,
      Total: acc.Total + (entry.REG + entry.OT + entry.VACATION + entry.PTO + entry.Holiday + entry.Sick),
      Deduct: acc.Deduct + entry.Deduct,
      Commission: acc.Commission + entry.Commission
    }), {
      REG: 0, OT: 0, VACATION: 0, PTO: 0, Holiday: 0, Sick: 0, Total: 0, Deduct: 0, Commission: 0
    });

    // Prepare table data
    const tableData = entries.map(entry => [
      entry.Last_Name,
      entry.First_Name,
      entry.REG.toFixed(2),
      entry.OT.toFixed(2),
      entry.VACATION.toFixed(2),
      entry.PTO.toFixed(2),
      entry.Holiday.toFixed(2),
      entry.Sick.toFixed(2),
      (entry.REG + entry.OT + entry.VACATION + entry.PTO + entry.Holiday + entry.Sick).toFixed(2),
      entry.Deduct.toFixed(2),
      entry.Commission.toFixed(2),
      entry.ID_Record_Employee,
      entry.Pay_Period,
      entry.Today_Date
    ]);

    // Add totals row
    tableData.push([
      'TOTALS',
      '',
      totals.REG.toFixed(2),
      totals.OT.toFixed(2),
      totals.VACATION.toFixed(2),
      totals.PTO.toFixed(2),
      totals.Holiday.toFixed(2),
      totals.Sick.toFixed(2),
      totals.Total.toFixed(2),
      totals.Deduct.toFixed(2),
      totals.Commission.toFixed(2),
      '',
      '',
      ''
    ]);

    // Add table
    (doc as any).autoTable({
      head: [[
        'LAST',
        'FIRST',
        'REG',
        'OT',
        'VACATION',
        'PTO',
        'Holiday',
        'Sick',
        'TOTAL',
        'DEDUCT',
        'Commission',
        'ID Record Employee',
        'Pay Period',
        'Today Date'
      ]],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'left'
      },
      columnStyles: {
        0: { fontStyle: 'bold' }, // Last Name
        1: { fontStyle: 'normal' }, // First Name
        2: { halign: 'right' }, // REG
        3: { halign: 'right' }, // OT
        4: { halign: 'right' }, // VACATION
        5: { halign: 'right' }, // PTO
        6: { halign: 'right' }, // Holiday
        7: { halign: 'right' }, // Sick
        8: { halign: 'right', fontStyle: 'bold' }, // TOTAL
        9: { halign: 'right', textColor: [255, 0, 0] }, // DEDUCT
        10: { halign: 'right', textColor: [0, 0, 255] }, // Commission
        11: { fontSize: 7 }, // ID Record Employee
        12: { fontSize: 7 }, // Pay Period
        13: { fontSize: 7 } // Today Date
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center'
      },
      didParseCell: function(data: any) {
        // Style the totals row
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          if (data.column.index >= 2 && data.column.index <= 10) {
            data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      }
    });

    // Save the PDF with date in filename
    const fileName = `payroll-timesheet-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={generatePDF}
      disabled={entries.length === 0}
      sx={{ mt: 2 }}
    >
      Generate PDF Report
    </Button>
  );
};

export default PDFGenerator;

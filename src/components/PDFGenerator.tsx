import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { EmployeeTime, PayPeriod } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PayrollAPI } from '../services/api';

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
  const [payPeriods, setPayPeriods] = useState<Record<number, PayPeriod>>({});

  useEffect(() => {
    const fetchPayPeriods = async () => {
      try {
        const response = await PayrollAPI.getPayPeriods();
        const periodsMap = response.Result.reduce((acc, period) => {
          acc[period.PK_ID] = period;
          return acc;
        }, {} as Record<number, PayPeriod>);
        setPayPeriods(periodsMap);
      } catch (error) {
        console.error('Error fetching pay periods:', error);
      }
    };
    fetchPayPeriods();
  }, []);

  const formatPayPeriod = (payPeriodId: number) => {
    const period = payPeriods[payPeriodId];
    if (!period) return 'N/A';
    return `Period ${period.period_number} (${period.start_date} - ${period.end_date})`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Group entries by pay period
    const entriesByPeriod = entries.reduce((acc, entry) => {
      const periodId = entry.pay_period_id;
      if (!acc[periodId]) {
        acc[periodId] = [];
      }
      acc[periodId].push(entry);
      return acc;
    }, {} as Record<number, EmployeeTime[]>);

    let startY = 15;
    const pageHeight = doc.internal.pageSize.height;

    Object.entries(entriesByPeriod).forEach(([periodId, periodEntries]) => {
      const period = payPeriods[Number(periodId)];
      if (!period) return;

      // Add title and period info
      if (startY > pageHeight - 20) {
        doc.addPage();
        startY = 15;
      }

      doc.setFontSize(16);
      doc.text('Payroll Time Sheet', 14, startY);
      doc.setFontSize(12);
      doc.text(`Pay Period ${period.period_number} (${period.start_date} - ${period.end_date})`, 14, startY + 10);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, startY + 20);

      // Calculate totals for this period
      const totals = periodEntries.reduce((acc, entry) => ({
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
      const tableData = periodEntries.map(entry => [
        entry.employee?.Last_Name || 'N/A',
        entry.employee?.First_Name || 'N/A',
        entry.employee?.Department || 'N/A',
        entry.REG.toFixed(2),
        entry.OT.toFixed(2),
        entry.VACATION.toFixed(2),
        entry.PTO.toFixed(2),
        entry.Holiday.toFixed(2),
        entry.Sick.toFixed(2),
        (entry.REG + entry.OT + entry.VACATION + entry.PTO + entry.Holiday + entry.Sick).toFixed(2),
        entry.Deduct.toFixed(2),
        entry.Commission.toFixed(2),
        entry.status
      ]);

      // Add totals row
      tableData.push([
        'TOTALS',
        '',
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
        ''
      ]);

      // Add table
      (doc as any).autoTable({
        head: [[
          'Last Name',
          'First Name',
          'Department',
          'Regular',
          'Overtime',
          'Vacation',
          'PTO',
          'Holiday',
          'Sick',
          'Total Hours',
          'Deductions',
          'Commission',
          'Status'
        ]],
        body: tableData,
        startY: startY + 30,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          halign: 'left'
        },
        columnStyles: {
          0: { fontStyle: 'bold' }, // Last Name
          1: { fontStyle: 'normal' }, // First Name
          2: { fontStyle: 'normal' }, // Department
          3: { halign: 'right' }, // REG
          4: { halign: 'right' }, // OT
          5: { halign: 'right' }, // VACATION
          6: { halign: 'right' }, // PTO
          7: { halign: 'right' }, // Holiday
          8: { halign: 'right' }, // Sick
          9: { halign: 'right', fontStyle: 'bold' }, // Total
          10: { halign: 'right', textColor: [255, 0, 0] }, // Deductions
          11: { halign: 'right', textColor: [0, 0, 255] }, // Commission
          12: { halign: 'center' } // Status
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
            if (data.column.index >= 3 && data.column.index <= 11) {
              data.cell.styles.fillColor = [240, 240, 240];
            }
          }
        },
        didDrawPage: function(data: any) {
          // Update startY for next period
          startY = data.cursor.y + 20;
        }
      });

      // Add page break between periods if needed
      if (startY > pageHeight - 40) {
        doc.addPage();
        startY = 15;
      } else {
        startY += 20;
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

import React, { useState, useEffect } from 'react';
import { PayrollAPI } from '../services/api';
import { EmployeeTime, PayPeriod } from '../types';

interface TimeEntryFormProps {
  onSubmit: (data: EmployeeTime) => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSubmit }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [reg, setReg] = useState(0);
  const [ot, setOt] = useState(0);
  const [vacation, setVacation] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const [pto, setPto] = useState(0);
  const [sick, setSick] = useState(0);
  const [deduct, setDeduct] = useState(0);
  const [commission, setCommission] = useState(0);
  const [note, setNote] = useState('');
  const [currentPayPeriod, setCurrentPayPeriod] = useState<PayPeriod | null>(null);

  useEffect(() => {
    // Fetch current pay period when component mounts
    const fetchCurrentPayPeriod = async () => {
      try {
        const response = await PayrollAPI.getCurrentPayPeriod();
        if (response.Result.length > 0) {
          setCurrentPayPeriod(response.Result[0]);
        }
      } catch (error) {
        console.error('Error fetching current pay period:', error);
      }
    };

    fetchCurrentPayPeriod();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPayPeriod) {
      alert('No active pay period found');
      return;
    }

    const total = reg + ot + vacation + holiday + pto + sick;

    const timeEntry: EmployeeTime = {
      pay_period_id: currentPayPeriod.PK_ID,
      ID_Record_Employee: employeeId,
      REG: reg,
      OT: ot,
      VACATION: vacation,
      Holiday: holiday,
      PTO: pto,
      Sick: sick,
      Total: total,
      Deduct: deduct,
      Commission: commission,
      Today_Date: new Date().toISOString().split('T')[0],
      NOTE: note,
      status: 'pending'
    };

    onSubmit(timeEntry);

    // Reset form
    setEmployeeId('');
    setReg(0);
    setOt(0);
    setVacation(0);
    setHoliday(0);
    setPto(0);
    setSick(0);
    setDeduct(0);
    setCommission(0);
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Employee ID
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Regular Hours
            <input
              type="number"
              value={reg}
              onChange={(e) => setReg(Number(e.target.value))}
              min="0"
              step="0.25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Overtime Hours
            <input
              type="number"
              value={ot}
              onChange={(e) => setOt(Number(e.target.value))}
              min="0"
              step="0.25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vacation Hours
            <input
              type="number"
              value={vacation}
              onChange={(e) => setVacation(Number(e.target.value))}
              min="0"
              step="0.25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Holiday Hours
            <input
              type="number"
              value={holiday}
              onChange={(e) => setHoliday(Number(e.target.value))}
              min="0"
              step="0.25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            PTO Hours
            <input
              type="number"
              value={pto}
              onChange={(e) => setPto(Number(e.target.value))}
              min="0"
              step="0.25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sick Hours
            <input
              type="number"
              value={sick}
              onChange={(e) => setSick(Number(e.target.value))}
              min="0"
              step="0.25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deductions
            <input
              type="number"
              value={deduct}
              onChange={(e) => setDeduct(Number(e.target.value))}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Commission
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={!currentPayPeriod || currentPayPeriod.status === 'closed'}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Submit Time Entry
        </button>
        {currentPayPeriod && currentPayPeriod.status === 'closed' && (
          <p className="mt-2 text-sm text-red-600">Cannot submit entries for a closed pay period</p>
        )}
        {!currentPayPeriod && (
          <p className="mt-2 text-sm text-red-600">No active pay period found</p>
        )}
      </div>
    </form>
  );
};

export default TimeEntryForm;

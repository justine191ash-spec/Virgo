
import React, { useState, useEffect } from 'react';
import { AttendanceRecord } from '../types';

interface CheckInFormProps {
  onCheckIn: (record: AttendanceRecord) => void;
}

const DEPARTMENTS = [
  'HR',
  'Engineering',
  'logistics',
  'Admin',
  'Production Sec 1A',
  'Production Sec 1B',
  'Production Sec 1C',
  'Production Sec 2',
  'Production Sec 3',
  'SHE',
  'QA'
];

const CheckInForm: React.FC<CheckInFormProps> = ({ onCheckIn }) => {
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Set default date and time on mount
  useEffect(() => {
    const now = new Date();
    const d = now.toISOString().split('T')[0];
    const t = now.toTimeString().split(' ')[0].substring(0, 5);
    setDate(d);
    setTime(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department || !employeeNumber) return;

    const record: AttendanceRecord = {
      id: crypto.randomUUID(),
      name,
      employeeNumber,
      department,
      date,
      arrivalTime: time,
      timestamp: Date.now()
    };

    onCheckIn(record);
    setSubmitted(true);
    
    // Reset form after a few seconds or allow another entry
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmployeeNumber('');
      setDepartment('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Check-in Successful</h2>
        <p className="text-gray-500">Thank you, {name}. Have a productive day!</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 text-blue-600 font-medium hover:underline"
        >
          New Check-in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
        <p className="text-gray-500">Please record your arrival details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Juan Dela Cruz"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee Number</label>
          <input
            required
            type="text"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            placeholder="e.g. 2024-001"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white shadow-sm"
          >
            <option value="" disabled>Select Department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arrival Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-4 mt-4 rounded-xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-gray-200"
        >
          Check In Now
        </button>
      </form>
    </div>
  );
};

export default CheckInForm;

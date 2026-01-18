
import React, { useState } from 'react';
import { AttendanceRecord } from '../types';

interface HRDashboardProps {
  records: AttendanceRecord[];
}

const HR_PASSWORD = '@RMFIwecandoit';

const HRDashboard: React.FC<HRDashboardProps> = ({ records }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === HR_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPasswordInput('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">HR Access Restricted</h2>
          <p className="text-gray-500 mb-8">Please enter the administrative password to view the attendance log.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter HR Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-lg`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs font-medium">Incorrect password. Please try again.</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              Verify Identity
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(filter.toLowerCase()) || 
    r.department.toLowerCase().includes(filter.toLowerCase()) ||
    r.employeeNumber.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">Attendance Log</h2>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Authorized</span>
          </div>
          <p className="text-gray-500 text-sm">Real-time backup of RMFI employee arrivals</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, ID or dept..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 shadow-sm"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400">No records found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Number</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Arrival</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 mr-3">
                        {record.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-gray-600">{record.employeeNumber}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                      {record.department}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{record.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-bold">{record.arrivalTime}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Manual Check</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-10 text-gray-400">No results for "{filter}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;

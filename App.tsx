
import React, { useState, useEffect } from 'react';
import CheckInForm from './components/CheckInForm';
import HRDashboard from './components/HRDashboard';
import ImagePlayground from './components/ImagePlayground';
import { AppView, AttendanceRecord } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('check-in');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Load initial records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('attendance_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved records", e);
      }
    }
  }, []);

  const handleAddRecord = (record: AttendanceRecord) => {
    const updated = [record, ...records];
    setRecords(updated);
    localStorage.setItem('attendance_records', JSON.stringify(updated));
  };

  const NavButton: React.FC<{ target: AppView; label: string }> = ({ target, label }) => (
    <button
      onClick={() => setView(target)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        view === target 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AC</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">ArriveCheck</h1>
          </div>
          <nav className="hidden sm:flex space-x-2">
            <NavButton target="check-in" label="Check In" />
            <NavButton target="hr-dashboard" label="HR Dashboard" />
            <NavButton target="ai-playground" label="AI Playground" />
          </nav>
          {/* Mobile indicator or simple icon would go here */}
        </div>
        {/* Mobile Nav */}
        <div className="sm:hidden flex justify-around p-2 bg-gray-50 border-t">
          <NavButton target="check-in" label="Check In" />
          <NavButton target="hr-dashboard" label="HR" />
          <NavButton target="ai-playground" label="AI" />
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
          {view === 'check-in' && (
            <CheckInForm onCheckIn={handleAddRecord} />
          )}
          {view === 'hr-dashboard' && (
            <HRDashboard records={records} />
          )}
          {view === 'ai-playground' && (
            <ImagePlayground />
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} ArriveCheck • Internal Backup Tool</p>
      </footer>
    </div>
  );
};

export default App;

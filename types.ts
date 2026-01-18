
export interface AttendanceRecord {
  id: string;
  name: string;
  employeeNumber: string;
  department: string;
  date: string;
  arrivalTime: string;
  timestamp: number;
}

export type AppView = 'check-in' | 'hr-dashboard' | 'ai-playground';

export type ImageResolution = '1K' | '2K' | '4K';

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

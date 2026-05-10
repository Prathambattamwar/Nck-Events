export interface Shibir {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
}

export interface JapaStats {
  totalMantraCount: number;
  totalMalasCompleted: number;
  lastSession: string;
}

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

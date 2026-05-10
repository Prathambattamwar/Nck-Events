import { Shibir } from './types';

export const INITIAL_SHIBIRS: Shibir[] = [
  {
    id: '1',
    title: 'Spiritual Youth Retreat 2024',
    description: 'A deep dive into meditation and self-discovery for the youth of today.',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    location: 'Mumbai Ashram',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Yoga & Wellness Shibir',
    description: 'Rejuvenate your body and mind through ancient yoga techniques and healthy living.',
    startDate: '2024-07-10',
    endDate: '2024-07-15',
    location: 'Lonavala Hills',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
  }
];

export const STORAGE_KEY = 'shibirs_data';

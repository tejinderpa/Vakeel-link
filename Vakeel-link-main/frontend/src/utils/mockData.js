export const MOCK_CONSULTATIONS = [
  {
    id: 1,
    lawyerName: 'Adv. Rajesh Kumar',
    specialization: 'Criminal Law',
    date: '2024-05-15',
    time: '10:30 AM',
    status: 'Confirmed',
    type: 'Video Call',
  },
  {
    id: 2,
    lawyerName: 'Adv. Priya Sharma',
    specialization: 'Family Law',
    date: '2024-05-18',
    time: '02:00 PM',
    status: 'Pending',
    type: 'In-person',
  },
  {
    id: 3,
    lawyerName: 'Adv. Vikram Singh',
    specialization: 'Constitutional Law',
    date: '2024-05-20',
    time: '11:00 AM',
    status: 'Confirmed',
    type: 'Video Call',
  }
];

export const MOCK_ACTIVITY = [
  {
    id: 1,
    type: 'AI_SEARCH',
    title: 'Property Dispute Analysis',
    timestamp: '2 hours ago',
    detail: 'Ran Prism AI on Section 441 of IPC.',
  },
  {
    id: 2,
    type: 'LAWYER_SAVE',
    title: 'Saved Profile',
    timestamp: '5 hours ago',
    detail: 'Saved Adv. Anjali Gupta to favorites.',
  },
  {
    id: 3,
    type: 'CONSULTATION',
    title: 'Meeting Scheduled',
    timestamp: 'Yesterday',
    detail: 'Consultation with Adv. Rajesh Kumar confirmed.',
  },
  {
    id: 4,
    type: 'DOCUMENT',
    title: 'Document Uploaded',
    timestamp: '2 days ago',
    detail: 'Affidavit_Draft_v1.pdf added to Case VK-8821.',
  }
];

export const MOCK_STATS = {
  openMatters: 6,
  savedLawyers: 14,
  aiRuns: 32,
  responseTime: '8m',
};

export const MOCK_LAWYERS = [
  {
    id: 1,
    name: 'Adv. Rajesh Kumar',
    specialization: 'Criminal Law',
    rating: 4.9,
    experience: 15,
    location: 'New Delhi',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    name: 'Adv. Priya Sharma',
    specialization: 'Family Law',
    rating: 4.8,
    experience: 10,
    location: 'Mumbai',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: 'Adv. Vikram Singh',
    specialization: 'Constitutional Law',
    rating: 5.0,
    experience: 22,
    location: 'Chandigarh',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    name: 'Adv. Anjali Gupta',
    specialization: 'Corporate Law',
    rating: 4.7,
    experience: 12,
    location: 'Bangalore',
    avatar: 'https://i.pravatar.cc/150?u=4',
  }
];

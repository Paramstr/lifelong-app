export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

export interface RoadmapVersion {
  id: string;
  version: string;
  title: string;
  status: 'current' | 'next' | 'future';
  features: Feature[];
}

export const ROADMAP_DATA: RoadmapVersion[] = [
  {
    id: 'v1',
    version: 'V1.0',
    title: 'Foundations',
    status: 'current',
    features: [
      {
        id: 'food',
        title: 'Food Tracking',
        description: 'Log meals with AI analysis',
        icon: 'fork.knife',
        iconColor: '#FF9F0A',
      },
      {
        id: 'records',
        title: 'Health Records',
        description: 'Store & organize medical files',
        icon: 'doc.text.fill',
        iconColor: '#0A84FF',
      },
      {
        id: 'ai',
        title: 'Daily AI Info',
        description: 'Rudimentary health insights',
        icon: 'sparkles',
        iconColor: '#BF5AF2',
      },
    ],
  },
  {
    id: 'v2',
    version: 'Next',
    title: 'Analysis',
    status: 'next',
    features: [
      {
        id: 'analysis',
        title: 'Deep Analysis',
        description: 'Parsing health records & blood tests',
        icon: 'waveform.path.ecg',
        iconColor: '#30D158',
      },
    ],
  },
  {
    id: 'v3',
    version: 'Future',
    title: 'Integration',
    status: 'future',
    features: [
      {
        id: 'apple-health',
        title: 'Apple Health',
        description: 'Unified health record sync',
        icon: 'heart.fill',
        iconColor: '#FF375F',
      },
    ],
  },
  {
    id: 'v4',
    version: 'Future',
    title: 'Protocols',
    status: 'future',
    features: [
      {
        id: 'protocols',
        title: 'AI Protocols',
        description: 'Custom mobility, yoga & exercise plans',
        icon: 'figure.mind.and.body',
        iconColor: '#64D2FF',
      },
    ],
  },
];

export const CHANGELOG_ITEMS = [
  {
    version: '1.0.0 (42)',
    date: '2025-12-29',
    changes: [
      'Initial beta release',
      'Basic family tracking',
      'Protocol visualization',
    ],
  },
];

export const BETA_INFO = {
  version: '1.0.0',
  build: '42',
  description: 'Welcome to the Lifelong Beta. We are building the future of longevity.',
};
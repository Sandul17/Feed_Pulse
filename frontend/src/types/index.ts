export interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
  status: 'New' | 'In Review' | 'Planned' | 'In Progress' | 'Resolved' | 'Closed';
  submitterName?: string;
  submitterEmail?: string;
  ai_category?: string;
  ai_sentiment?: 'Positive' | 'Negative' | 'Neutral';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}
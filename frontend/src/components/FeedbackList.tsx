'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Feedback } from '@/types';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/feedback');
      setFeedbacks(response.data.data.feedback);
    } catch (error) {
      console.error('Failed to fetch feedbacks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/feedback/${id}`, { status: newStatus });
      toast.success('Status updated successfully!');
      fetchFeedbacks(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };
  
  const handleReAnalyze = async (id: string) => {
    try {
      await api.post(`/feedback/${id}/re-analyze`);
      toast.success('Re-analysis triggered!');
      fetchFeedbacks(); // Refresh list
    } catch (error) {
      toast.error('Failed to re-analyze.');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="space-y-4">
      {feedbacks.map((item) => (
        <div key={item._id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <div className="mt-4 space-x-2 flex flex-wrap">
                <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(item.ai_sentiment)}`}>
                  {item.ai_sentiment}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">
                  Priority: {item.ai_priority}
                </span>
                {item.ai_tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                    </span>
                ))}
              </div>
              {item.ai_summary && <p className="text-sm text-gray-500 mt-2 italic"><strong>AI Summary:</strong> {item.ai_summary}</p>}
            </div>
            <div className="flex flex-col items-end space-y-2 ml-4">
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                className="text-sm border rounded p-1"
              >
                <option>New</option>
                <option>In Review</option>
                <option>Planned</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
              <button onClick={() => handleReAnalyze(item._id)} className="text-xs text-indigo-600 hover:underline flex items-center">
                <RefreshCw className="w-3 h-3 mr-1" /> Re-Analyze
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getSentimentColor(sentiment?: string) {
  switch (sentiment) {
    case 'Positive': return 'bg-green-100 text-green-800';
    case 'Negative': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
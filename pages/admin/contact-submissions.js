import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import AdminLayout from '../../components/AdminLayout';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Card, CardContent } from '../../components/ui/card';
import { Mail, Phone, Building2, CheckCircle, XCircle, Loader, ArrowDown, ArrowUp } from 'lucide-react';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, new, contacted, closed
  const [sort, setSort] = useState({ field: 'submitted_at', direction: 'desc' });
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchSubmissions();
  }, [filter, sort]);

  async function fetchSubmissions() {
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order(sort.field, { ascending: sort.direction === 'asc' });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setSubmissions(data || []);
    } catch (error) {
      setError('Failed to load submissions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const { error: updateError } = await supabase
        .from('contact_submissions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;
      fetchSubmissions();
    } catch (error) {
      setError('Failed to update status');
      console.error('Error:', error);
    }
  }

  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getLeadScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
            <p className="mt-2 text-gray-600">Manage and respond to contact form submissions</p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            >
              <option value="all">All Submissions</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>

            <button
              onClick={() => fetchSubmissions()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-8 h-8 text-emerald-pool animate-spin" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No submissions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('submitted_at')}
                      >
                        <div className="flex items-center">
                          Date
                          {sort.field === 'submitted_at' && (
                            sort.direction === 'desc' ? <ArrowDown className="w-4 h-4 ml-1" /> : <ArrowUp className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('company_size')}
                      >
                        <div className="flex items-center">
                          Company Info
                          {sort.field === 'company_size' && (
                            sort.direction === 'desc' ? <ArrowDown className="w-4 h-4 ml-1" /> : <ArrowUp className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('lead_score')}
                      >
                        <div className="flex items-center">
                          Contact Details
                          {sort.field === 'lead_score' && (
                            sort.direction === 'desc' ? <ArrowDown className="w-4 h-4 ml-1" /> : <ArrowUp className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(submission.submitted_at), 'MMM d, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{submission.company_size} employees</p>
                            <p className="text-gray-500">{submission.industry}</p>
                            <p className="text-gray-500">{submission.use_case}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {submission.first_name} {submission.last_name}
                            </p>
                            <p className="text-gray-500 flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {submission.work_email}
                            </p>
                            {submission.phone && (
                              <p className="text-gray-500 flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {submission.phone}
                              </p>
                            )}
                            <p className={`mt-1 font-medium ${getLeadScoreColor(submission.lead_score)}`}>
                              Score: {submission.lead_score}/10
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                            {submission.message}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${submission.status === 'new' ? 'bg-green-100 text-green-800' : 
                              submission.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {submission.status === 'new' && (
                              <button
                                onClick={() => updateStatus(submission.id, 'contacted')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {submission.status === 'contacted' && (
                              <button
                                onClick={() => updateStatus(submission.id, 'closed')}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Close
                              </button>
                            )}
                            {submission.status === 'closed' && (
                              <button
                                onClick={() => updateStatus(submission.id, 'new')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
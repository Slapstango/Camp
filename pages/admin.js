import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

// Admin Dashboard: Search, view, modify reservations
export default function AdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ensure Supabase client is initialized
  useEffect(() => {
    if (!supabase || typeof supabase.from !== 'function') {
      console.error('Supabase client not initialized properly', supabase);
      setError('Cannot connect to database.');
    }
  }, []);

  // Search reservations by name, phone, or email
  const handleSearch = async () => {
    if (!supabase || typeof supabase.from !== 'function') return;
    setLoading(true);
    setError('');
    const trimmed = search.trim();
    const term = '%' + trimmed + '%';

    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*, guests(*)')
        .or(
          'primary_name.ilike.' + term + ',' +
          'phone.ilike.' + term + ',' +
          'email.ilike.' + term
        );
      if (fetchError) throw fetchError;
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel a reservation
  const handleCancel = async (id) => {
    if (typeof window === 'undefined') return;
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const { error: delError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      if (delError) throw delError;
      setResults(results.filter(r => r.id !== id));
    } catch (err) {
      console.error('Cancel error:', err);
      alert(err.message || 'Cancellation failed.');
    }
  };

  // Mark payment as completed
  const handleMarkPaid = async (id) => {
    if (typeof window === 'undefined') return;
    const input = prompt('Enter amount paid (USD):');
    const amount = parseFloat(input);
    if (input === null || isNaN(amount)) return;
    try {
      const { error: payError } = await supabase
        .from('reservations')
        .update({ payment_collected: true, amount_paid: amount })
        .eq('id', id);
      if (payError) throw payError;
      setResults(results.map(r =>
        r.id === id ? { ...r, payment_collected: true, amount_paid: amount } : r
      ));
    } catch (err) {
      console.error('Mark paid error:', err);
      alert(err.message || 'Mark paid failed.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!loading && results.length === 0 && !error && (
        <p className="text-gray-600">No results found.</p>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Dates</th>
                <th className="border p-2">Site</th>
                <th className="border p-2">Primary Guest</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Stay Type</th>
                <th className="border p-2">Guests</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {r.start_date} → {r.end_date}
                  </td>
                  <td className="border p-2">{r.site_id}</td>
                  <td className="border p-2">
                    {r.primary_name} ({r.age})
                  </td>
                  <td className="border p-2">
                    {r.phone}, {r.email}
                  </td>
                  <td className="border p-2">
                    {r.stay_type}{r.unit_length ? ' (' + r.unit_length + ' ft)' : ''}
                  </td>
                  <td className="border p-2 break-words">
                    {r.guests.map(g => g.name + ' (' + g.age + ')').join(', ')}
                  </td>
                  <td className="border p-2">
                    {r.payment_collected ? 'Paid $' + r.amount_paid : 'Unpaid'}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => router.push('/admin/edit?id=' + r.id)}
                      className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleMarkPaid(r.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

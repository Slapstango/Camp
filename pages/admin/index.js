import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format, addDays } from 'date-fns';
import supabase from '../../lib/supabaseClient';
import CalendarGrid from '../../components/CalendarGrid';

export default function AdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Next 7 days for dashboard
  const today = new Date();
  const startDate = format(today, 'yyyy-MM-dd');
  const endDate = format(addDays(today, 6), 'yyyy-MM-dd');

  useEffect(() => {
    if (!supabase || typeof supabase.from !== 'function') {
      console.error('Supabase client not initialized', supabase);
      setError('Database connection error');
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setDisplayCount(10);
    const term = '%' + search.trim() + '%';

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Availability Dashboard */}
      <div className="mb-8">
        <CalendarGrid startDate={startDate} endDate={endDate} />
      </div>

      {/* Search Bar */}
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
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Search Results (paginated) */}
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Dates</th>
                <th className="border p-2">Site</th>
                <th className="border p-2">Primary Guest</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Stay Type</th>
                <th className="border p-2">Guests</th>
                <th className="border p-2">Guest Ages</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, displayCount).map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border p-2">{r.start_date} → {r.end_date}</td>
                  <td className="border p-2">{r.site_id}</td>
                  <td className="border p-2">{r.primary_name}</td>
                  <td className="border p-2">{r.age}</td>
                  <td className="border p-2">{r.email}</td>
                  <td className="border p-2">{r.phone}</td>
                  <td className="border p-2">
                    {r.stay_type}{r.unit_length ? ' (' + r.unit_length + ' ft)' : ''}
                  </td>
                  <td className="border p-2">{r.guests.map(g => g.name).join(', ')}</td>
                  <td className="border p-2">{r.guests.map(g => g.age).join(', ')}</td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length > displayCount && (
            <button
              onClick={() => setDisplayCount(displayCount + 10)}
              className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Load More
            </button>
          )}
        </div>
      )}

      {results.length === 0 && !loading && (
        <p className="text-gray-600">No results to display.</p>
      )}
    </div>
  );
}

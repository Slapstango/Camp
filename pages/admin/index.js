import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';
import CalendarGrid from '../../components/CalendarGrid';
import { format, addDays } from 'date-fns';

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(undefined);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.user_metadata?.role !== 'admin') {
        router.replace('/admin/login');
      } else {
        setSession(session);
      }
    });
  }, [router]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setDisplayCount(10);
    const term = '%' + search.trim() + '%';
    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('id, site_id, start_date, end_date, primary_name, age, email, phone, stay_type, unit_length, payment_collected, amount_paid, guests(*)')
        .or(
          'primary_name.ilike.' + term + ',' +
          'phone.ilike.' + term + ',' +
          'email.ilike.' + term
        );
      if (fetchError) throw fetchError;
      setResults(data || []);
    } catch (err) {
      setError(err.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Really cancel this reservation?')) return;
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);
    if (error) alert('Cancel failed: ' + error.message);
    else setResults(rs => rs.filter(r => r.id !== id));
  };

  const handleMarkPaid = async (id) => {
    const amt = prompt('Enter amount paid (USD):');
    const num = parseFloat(amt);
    if (amt === null || isNaN(num)) return;
    const { error } = await supabase
      .from('reservations')
      .update({ payment_collected: true, amount_paid: num })
      .eq('id', id);
    if (error) alert('Mark paid failed: ' + error.message);
    else setResults(rs => rs.map(r => r.id === id ? { ...r, payment_collected: true, amount_paid: num } : r));
  };

  if (session === undefined) return <p className="p-8">Checking authentication…</p>;

  const today = new Date();
  const startDate = format(today, 'yyyy-MM-dd');
  const endDate = format(addDays(today, 6), 'yyyy-MM-dd');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <CalendarGrid
        startDate={startDate}
        endDate={endDate}
        onView={id => router.push(`/admin/edit?id=${id}`)}
      />

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

      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Dates</th>
                <th className="border p-2">Site</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Stay Type</th>
                <th className="border p-2">Guests</th>
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
                  <td className="border p-2">{r.stay_type}{r.unit_length ? ` (${r.unit_length} ft)` : ''}</td>
                  <td className="border p-2">{r.guests.map(g => g.name).join(', ')}</td>
                  <td className="border p-2">{r.payment_collected ? `Paid $${r.amount_paid}` : 'Unpaid'}</td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => router.push(`/admin/edit?id=${r.id}`)} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={() => handleCancel(r.id)} className="px-2 py-1 bg-red-500 text-white rounded">Cancel</button>
                    <button onClick={() => handleMarkPaid(r.id)} disabled={r.payment_collected} className="px-2 py-1 bg-green-600 text-white rounded">{r.payment_collected ? 'Paid' : 'Mark Paid'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}
      {results.length > displayCount && (
        <button
          onClick={() => setDisplayCount(dc => dc + 10)}
          className="mt-2 px-4 py-2 bg-gray-200 rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
}

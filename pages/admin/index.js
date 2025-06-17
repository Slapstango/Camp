import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';

export default function AdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase || typeof supabase.from !== 'function') {
      console.error('Supabase client not initialized properly', supabase);
      setError('Cannot connect to database.');
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
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

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel?')) return;
    try {
      const { error: delError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      if (delError) throw delError;
      setResults(results.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Cancel failed.');
    }
  };

  const handleMarkPaid = async (id) => {
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
      console.error(err);
      alert(err.message || 'Mark paid failed.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="border p-2 flex-grow rounded"
        />
        <button onClick={handleSearch} disabled={loading} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {loading ? 'Loading…' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {results.length === 0 && !loading && <p>No results found.</p>}
      {results.length > 0 && (
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
            {results.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border p-2">{r.start_date} → {r.end_date}</td>
                <td className="border p-2">{r.site_id}</td>
                <td className="border p-2">{r.primary_name}</td>
                <td className="border p-2">{r.age}</td>
                <td className="border p-2">{r.email}</td>
                <td className="border p-2">{r.phone}</td>
                <td className="border p-2">{r.stay_type}{r.unit_length ? ' ('+r.unit_length+' ft)' : ''}</td>
                <td className="border p-2">{r.guests.map(g=>g.name).join(', ')}</td>
                <td className="border p-2">{r.guests.map(g=>g.age).join(', ')}</td>
                <td className="border p-2">{r.payment_collected ? 'Paid $'+r.amount_paid : 'Unpaid'}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={()=>router.push('/admin/edit?id='+r.id)} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={()=>handleCancel(r.id)} className="px-2 py-1 bg-red-500 text-white rounded">Cancel</button>
                  <button onClick={()=>handleMarkPaid(r.id)} disabled={r.payment_collected} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50">Mark Paid</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

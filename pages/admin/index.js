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

  // Auth guard
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
        .select('*, guests(*)')
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
    if (error) {
      alert('Cancel failed: ' + error.message);
    } else {
      setResults(rs => rs.filter(r => r.id !== id));
    }
  };

  const handleMarkPaid = async (id) => {
    const amt = prompt('Enter amount paid (USD):');
    const num = parseFloat(amt);
    if (amt === null || isNaN(num)) return;
    const { error } = await supabase
      .from('reservations')
      .update({ payment_collected: true, amount_paid: num })
      .eq('id', id);
    if (error) {
      alert('Mark paid failed: ' + error.message);
    } else {
      setResults(rs =>
        rs.map(r => r.id === id ? { ...r, payment_collected: true, amount_paid: num } : r)
      );
    }
  };

  if (session === undefined) {
    return <p className="p-8">Checking authentication…</p>;
  }

  const today = new Date();
  const startDate = format(today, 'yyyy-MM-dd');
  const endDate = format(addDays(today, 6), 'yyyy-MM-dd');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Create Reservation
        </button>
      </div>

      <CalendarGrid
        startDate={startDate}
        endDate={endDate}
        onView={reservationId => router.push(`/admin/edit?id=${reservationId}`)}
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
      {/* ...results table... */}
    </div>
);
}

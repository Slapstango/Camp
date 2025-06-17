import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';

export default function EditReservationPage() {
  const router = useRouter();
  const { id } = router.query;

  // State hooks
  const [session, setSession] = useState(null);
  const [reservation, setReservation] = useState({
    siteId: '', startDate: '', endDate: '',
    primaryName: '', age: '', email: '', phone: '',
    stayType: '', unitLength: '',
    guests: [],
    payment_collected: false,
    amount_paid: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
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

  // Fetch reservation data
  useEffect(() => {
    if (!router.isReady || session === null) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, guests(*)')
          .eq('id', id)
          .single();
        if (error) throw error;
        setReservation({
          siteId: data.site_id,
          startDate: data.start_date,
          endDate: data.end_date,
          primaryName: data.primary_name,
          age: String(data.age),
          email: data.email,
          phone: data.phone,
          stayType: data.stay_type,
          unitLength: data.unit_length ? String(data.unit_length) : '',
          guests: data.guests.map(g => ({ name: g.name, age: String(g.age) })),
          payment_collected: data.payment_collected,
          amount_paid: data.amount_paid || 0
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, session, id]);

  // Handlers
  const handleChange = (field, value) =>
    setReservation(r => ({ ...r, [field]: value }));

  const handleGuestChange = (i, field, value) =>
    setReservation(r => {
      const guests = [...r.guests];
      guests[i][field] = value;
      return { ...r, guests };
    });

  const addGuest = () =>
    setReservation(r => ({ ...r, guests: [...r.guests, { name: '', age: '' }] }));

  const removeGuest = i =>
    setReservation(r => ({ ...r, guests: r.guests.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await supabase.from('reservations')
        .update({
          site_id: reservation.siteId,
          start_date: reservation.startDate,
          end_date: reservation.endDate,
          primary_name: reservation.primaryName,
          age: Number(reservation.age),
          email: reservation.email,
          phone: reservation.phone,
          stay_type: reservation.stayType,
          unit_length: reservation.unitLength ? Number(reservation.unitLength) : null,
          guest_count: reservation.guests.length,
          payment_collected: reservation.payment_collected,
          amount_paid: reservation.amount_paid
        })
        .eq('id', id);
      await supabase.from('guests').delete().eq('reservation_id', id);
      if (reservation.guests.length) {
        await supabase.from('guests').insert(
          reservation.guests.map(g => ({ reservation_id: id, name: g.name, age: Number(g.age) }))
        );
      }
      setMessage('Reservation updated successfully.');
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async () => {
    const input = prompt('Enter amount paid (USD):', reservation.amount_paid.toString());
    if (input === null) return;
    const num = parseFloat(input);
    if (isNaN(num)) {
      alert('Invalid amount');
      return;
    }
    setReservation(r => ({ ...r, payment_collected: true, amount_paid: num }));
  };

  // Render
  if (session === null) return <p className="p-8">Checking authentication…</p>;
  if (loading) return <p>Loading reservation…</p>;

  // Format reservation number: YY-id
  const year2 = reservation.startDate
    ? new Date(reservation.startDate).getFullYear().toString().slice(2)
    : new Date().getFullYear().toString().slice(2);
  const resNumber = `${year2}-${id}`;

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-2">Edit Reservation #{resNumber}</h2>
      <div className="mb-4">
        <strong>Status:</strong> {reservation.payment_collected ? (
          <>Paid (${reservation.amount_paid})</>
        ) : (
          <>Unpaid</>
        )}
        {!reservation.payment_collected && (
          <button
            onClick={handleMarkPaid}
            className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Mark as Paid
          </button>
        )}
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {/* form fields... */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

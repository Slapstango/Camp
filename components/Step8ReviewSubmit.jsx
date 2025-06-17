import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function Step8ReviewSubmit({ reservation, prevStep }) {
  const [submitting, setSubmitting] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // 1) Insert reservation AND return the new id
      const { data: resData, error: resError } = await supabase
        .from('reservations')
        .insert([{
          site_id: reservation.siteId,
          start_date: reservation.startDate,
          end_date:   reservation.endDate,
          primary_name: reservation.primaryName,
          phone:       reservation.phone,
          email:       reservation.email,
          age:         Number(reservation.age),
          stay_type:   reservation.stayType,
          unit_length: reservation.unitLength ? Number(reservation.unitLength) : null,
          guest_count: reservation.guests.length
        }])
        .select('id');           // ← ← ← must add this

      if (resError) throw resError;
      const reservationId = resData[0].id;

      // 2) Insert guests if any
      if (reservation.guests.length > 0) {
        const { error: guestsError } = await supabase
          .from('guests')
          .insert(
            reservation.guests.map(g => ({
              reservation_id: reservationId,
              name: g.name,
              age:  Number(g.age)
            }))
          );
        if (guestsError) throw guestsError;
      }

      // 3) All good!
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 rounded">
        <h2 className="text-2xl font-semibold mb-2">🎉 Reservation Confirmed!</h2>
        <p>
          You’ve booked <strong>{reservation.siteId}</strong> 
          from <strong>{reservation.startDate}</strong> 
          to <strong>{reservation.endDate}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* … your existing review UI … */}
      {error && <p className="text-red-600">Error: {error}</p>}
      <div className="flex space-x-2">
        <button
          onClick={prevStep}
          disabled={submitting}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Confirm Reservation'}
        </button>
      </div>
    </div>
  );
}

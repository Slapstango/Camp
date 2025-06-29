import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function Step8ReviewSubmit({ reservation, prevStep }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const { data: resData, error: resError } = await supabase
        .from('reservations')
        .insert([{
          site_id:      reservation.siteId,
          start_date:   reservation.startDate,
          end_date:     reservation.endDate,
          primary_name: reservation.primaryName,
          phone:        reservation.phone,
          email:        reservation.email,
          age:          Number(reservation.age),
          stay_type:    reservation.stayType,
          unit_length:  reservation.unitLength ? Number(reservation.unitLength) : null,
          guest_count:  reservation.guests.length
        }])
        .select('id');

      if (resError) throw resError;

      if (reservation.guests.length > 0) {
        const { error: guestsError } = await supabase
          .from('guests')
          .insert(
            reservation.guests.map(g => ({
              reservation_id: resData[0].id,
              name:           g.name,
              age:            Number(g.age)
            }))
          );
        if (guestsError) throw guestsError;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 rounded space-y-3">
        <h2 className="text-2xl font-semibold">🎉 Reservation Confirmed!</h2>
        <ul className="list-disc list-inside">
          <li><strong>Site:</strong> {reservation.siteId}</li>
          <li><strong>Dates:</strong> {reservation.startDate} → {reservation.endDate}</li>
          <li><strong>Primary Guest:</strong> {reservation.primaryName} ({reservation.age} yrs)</li>
          <li><strong>Contact:</strong> {reservation.phone}, {reservation.email}</li>
          <li><strong>Stay Type:</strong> {reservation.stayType}{reservation.unitLength ? ` (${reservation.unitLength} ft)` : ''}</li>
          {reservation.guests.length > 0 && (
            <li>
              <strong>Additional Guests:</strong>
              <ul className="list-decimal list-inside ml-4">
                {reservation.guests.map((g, idx) => (
                  <li key={idx}>{g.name} ({g.age} yrs)</li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Review Your Reservation</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Site:</strong> {reservation.siteId}</li>
        <li><strong>Dates:</strong> {reservation.startDate} → {reservation.endDate}</li>
        <li><strong>Name:</strong> {reservation.primaryName} ({reservation.age} yrs)</li>
        <li><strong>Contact:</strong> {reservation.phone}, {reservation.email}</li>
        <li><strong>Stay Type:</strong> {reservation.stayType}{reservation.unitLength ? ` (${reservation.unitLength} ft)` : ''}</li>
        {reservation.guests.length > 0 && (
          <li>
            <strong>Additional Guests:</strong>
            <ul className="list-decimal list-inside ml-4">
              {reservation.guests.map((g, idx) => (
                <li key={idx}>{g.name} ({g.age} yrs)</li>
              ))}
            </ul>
          </li>
        )}
      </ul>
      <p className="text-yellow-600 font-medium">
        Please register at the office and pay upon arrival.
      </p>
      {error && <p className="text-red-600">Error: {error}</p>}
      <div className="flex space-x-2">
        <button onClick={prevStep} disabled={submitting} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Back
        </button>
        <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Confirm Reservation'}
        </button>
      </div>
    </div>
  );
}

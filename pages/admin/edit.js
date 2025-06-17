import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';

export default function EditReservationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [session, setSession] = useState(undefined);

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.user_metadata?.role !== 'admin') {
        router.replace('/admin/login');
      } else {
        setSession(session);
      }
    });
  }, []);

  if (session === undefined) {
    return <p className="p-8">Checking authentication...</p>;
  }

  const [reservation, setReservation] = useState({
    siteId: '',
    startDate: '',
    endDate: '',
    primaryName: '',
    age: '',
    email: '',
    phone: '',
    stayType: '',
    unitLength: '',
    guests: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch reservation on load
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, guests(*)')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } else {
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
          guests: data.guests.map(g => ({ name: g.name, age: String(g.age) }))
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const handleChange = (field, value) => {
    setReservation(prev => ({ ...prev, [field]: value }));
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...reservation.guests];
    updated[index][field] = value;
    setReservation(prev => ({ ...prev, guests: updated }));
  };

  const addGuest = () => {
    setReservation(prev => ({
      ...prev,
      guests: [...prev.guests, { name: '', age: '' }]
    }));
  };

  const removeGuest = (index) => {
    setReservation(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Update reservation
      const { error: resError } = await supabase
        .from('reservations')
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
          guest_count: reservation.guests.length
        })
        .eq('id', id);
      if (resError) throw resError;

      // Replace guests
      await supabase.from('guests').delete().eq('reservation_id', id);
      if (reservation.guests.length) {
        const { error: guestError } = await supabase
          .from('guests')
          .insert(
            reservation.guests.map(g => ({
              reservation_id: id,
              name: g.name,
              age: Number(g.age)
            }))
          );
        if (guestError) throw guestError;
      }

      setMessage('Reservation updated successfully.');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Edit Reservation #{id}</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <div className="space-y-4">
        <div>
          <label>Site</label>
          <input
            value={reservation.siteId}
            onChange={e => handleChange('siteId', e.target.value)}
            className="block border p-1 w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={reservation.startDate}
              onChange={e => handleChange('startDate', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={reservation.endDate}
              onChange={e => handleChange('endDate', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Name</label>
            <input
              value={reservation.primaryName}
              onChange={e => handleChange('primaryName', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
          <div>
            <label>Age</label>
            <input
              type="number"
              value={reservation.age}
              onChange={e => handleChange('age', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              value={reservation.email}
              onChange={e => handleChange('email', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              value={reservation.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
        </div>
        <div>
          <label>Stay Type</label>
          <select
            value={reservation.stayType}
            onChange={e => handleChange('stayType', e.target.value)}
            className="block border p-1 w-full"
          >
            <option value="">Select...</option>
            <option value="Tent">Tent</option>
            <option value="Travel Trailer">Travel Trailer</option>
            <option value="Class A">Class A</option>
            <option value="Class B">Class B</option>
            <option value="Class C">Class C</option>
            <option value="Cabin">Cabin</option>
          </select>
        </div>
        {['Travel Trailer','Class A','Class B','Class C'].includes(reservation.stayType) && (
          <div>
            <label>Unit Length (ft)</label>
            <input
              type="number"
              value={reservation.unitLength}
              onChange={e => handleChange('unitLength', e.target.value)}
              className="block border p-1 w-full"
            />
          </div>
        )}
        <div>
          <label className="block mb-2 font-semibold">Additional Guests</label>
          {reservation.guests.map((g, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={g.name}
                onChange={e => handleGuestChange(idx, 'name', e.target.value)}
                className="border p-1 flex-1"
              />
              <input
                type="number"
                placeholder="Age"
                value={g.age}
                onChange={e => handleGuestChange(idx, 'age', e.target.value)}
                className="border p-1 w-20"
              />
              {reservation.guests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGuest(idx)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >Remove</button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addGuest}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          >Add Guest</button>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >{saving ? 'Saving…' : 'Save'}</button>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

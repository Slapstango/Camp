import supabase from '../lib/supabaseClient';

// Supabase client moved to shared module'https://bwjihwxkudaojlnqvyux.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3amlod3hrdWRhb2psbnF2eXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTAyNzEsImV4cCI6MjA2NTcyNjI3MX0.t___ZbeVJFMDsCW_uq9B6q-ChfrfM6BCV0cI6kayQdM');

export default function Step8ReviewSubmit({ reservation, prevStep }) {
  const handleSubmit = async () => {
    console.log("Submitting reservation:", reservation);

    const { data, error } = await supabase.from('reservations').insert([{
      site_id: reservation.siteId,
      start_date: reservation.startDate,
      end_date: reservation.endDate,
      primary_name: reservation.primaryName,
      phone: reservation.phone,
      email: reservation.email,
      age: parseInt(reservation.age),
      stay_type: reservation.stayType,
      unit_length: reservation.unitLength ? parseInt(reservation.unitLength) : null,
      guest_count: reservation.guests.length
    }]);

    if (error) {
      console.error('Reservation insert error:', error);
    } else {
      alert('Reservation submitted!');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 8: Review & Submit</h2>
      <pre className="bg-gray-100 p-4">{JSON.stringify(reservation, null, 2)}</pre>
      <div className="flex justify-between">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://bwjihwxkudaojlnqvyux.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3amlod3hrdWRhb2psbnF2eXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTAyNzEsImV4cCI6MjA2NTcyNjI3MX0.t___ZbeVJFMDsCW_uq9B6q-ChfrfM6BCV0cI6kayQdM');

const reservableSites = ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '17M', '18M', '19M'];
const cabinSites = ['C8', 'C9', '76'];

export default function Step2AvailabilityGrid({ reservation, setReservation, nextStep, prevStep }) {
  const [availableSites, setAvailableSites] = useState([]);

  useEffect(() => {
    if (reservation.startDate && reservation.endDate) {
      fetchAvailability();
    }
  }, [reservation.startDate, reservation.endDate]);

  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('site_id, start_date, end_date');

    if (error) {
      console.error('Error fetching reservations', error);
      return;
    }

    const reservedSiteIds = new Set();
    const resStart = new Date(reservation.startDate);
    const resEnd = new Date(reservation.endDate);

    for (let r of data) {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);

      if (resStart <= end && resEnd >= start) {
        reservedSiteIds.add(r.site_id);
      }
    }

    const filtered = reservableSites.filter(site => !reservedSiteIds.has(site));
    setAvailableSites(filtered);
  };

  const handleSelect = (site) => {
    setReservation({ ...reservation, siteId: site });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Select Available Site</h2>
      <p>Available sites for {reservation.startDate} to {reservation.endDate}:</p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {availableSites.map(site => (
          <button key={site} onClick={() => handleSelect(site)} className="p-2 border bg-green-200 hover:bg-green-300 rounded">
            {site}
          </button>
        ))}
      </div>
      <button onClick={prevStep} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Back</button>
    </div>
  );
}
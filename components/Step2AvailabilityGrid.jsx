import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import CalendarGrid from './CalendarGrid';

const reservableSites = ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '17M', '18M', '19M', 'C8', 'C9', '76'];

export default function Step2AvailabilityGrid({ reservation, setReservation, nextStep, prevStep }) {
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(reservation.siteId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reservation.startDate && reservation.endDate) {
      fetchAvailableSites();
    }
  }, [reservation.startDate, reservation.endDate]);

  const fetchAvailableSites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('site_id, start_date, end_date')
      .or(`and(start_date.lte.${reservation.endDate},end_date.gte.${reservation.startDate})`);

    if (error) {
      console.error("Error fetching reservations:", error.message);
      setAvailableSites([]);
      setLoading(false);
      return;
    }

    const reserved = new Set(data.map(r => r.site_id));
    const filtered = reservableSites.filter(site => !reserved.has(site));
    setAvailableSites(filtered);
    setLoading(false);
  };

  const handleSelect = () => {
    setReservation({ ...reservation, siteId: selectedSite });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Select a Site or Cabin</h2>
      {loading ? (
        <p>Checking availability...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Campground Map (Reference Only):</h3>
              <img src="/campground-map.png" alt="Campground Map" className="w-full border" />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Available Options:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSites.map(site => (
                  <button
                    key={site}
                    onClick={() => setSelectedSite(site)}
                    className={`p-2 rounded border ${selectedSite === site ? 'bg-blue-400 text-white' : 'bg-green-200 hover:bg-green-300'}`}
                  >
                    {site}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSelect}
                disabled={!selectedSite}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Calendar Grid:</h3>
            <CalendarGrid startDate={reservation.startDate} endDate={reservation.endDate} />
          </div>
        </>
      )}
      <div className="mt-6">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
      </div>
    </div>
  );
}
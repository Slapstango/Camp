import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CalendarGrid from './CalendarGrid';

const supabase = createClient(
  'https://bwjihwxkudaojlnqvyux.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // replace with your actual anon key
);

const reservableSites = ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '17M', '18M', '19M'];

export default function Step2AvailabilityGrid({ reservation, setReservation, nextStep, prevStep }) {
  const [availableSites, setAvailableSites] = useState([]);
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
      .not('end_date', 'lt', reservation.startDate)
      .not('start_date', 'gt', reservation.endDate);

    if (error) {
      console.error("Error fetching reservations:", error);
      setAvailableSites([]); return;
    }

    const reserved = new Set(data.map(r => r.site_id));
    const filtered = reservableSites.filter(site => !reserved.has(site));
    setAvailableSites(filtered);
    setLoading(false);
  };

  const handleSelect = (site) => {
    setReservation({ ...reservation, siteId: site });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Site Availability</h2>
      {loading ? (
        <p>Loading availability...</p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select from Available Sites:</h3>
            <div className="grid grid-cols-2 gap-3">
              {
      <button
        key="1M"
        onClick={() => handleSelect("1M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '80px', left: '120px' }}
      >
        1M
      </button>

      <button
        key="2M"
        onClick={() => handleSelect("2M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '110px', left: '170px' }}
      >
        2M
      </button>

      <button
        key="3M"
        onClick={() => handleSelect("3M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '140px', left: '220px' }}
      >
        3M
      </button>

      <button
        key="4M"
        onClick={() => handleSelect("4M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '170px', left: '270px' }}
      >
        4M
      </button>

      <button
        key="5M"
        onClick={() => handleSelect("5M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '200px', left: '320px' }}
      >
        5M
      </button>

      <button
        key="6M"
        onClick={() => handleSelect("6M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '230px', left: '370px' }}
      >
        6M
      </button>

      <button
        key="7M"
        onClick={() => handleSelect("7M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '260px', left: '420px' }}
      >
        7M
      </button>

      <button
        key="17M"
        onClick={() => handleSelect("17M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '300px', left: '100px' }}
      >
        17M
      </button>

      <button
        key="18M"
        onClick={() => handleSelect("18M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '330px', left: '150px' }}
      >
        18M
      </button>

      <button
        key="19M"
        onClick={() => handleSelect("19M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '360px', left: '200px' }}
      >
        19M
      </button>

              <button key={site} onClick={() => handleSelect(site)} className="bg-green-200 p-2 rounded hover:bg-green-300">
                  {site}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Map View:</h3>
            <div className="relative w-full max-w-3xl">
              <img src="/campground-map.png" alt="Campground Map" className="w-full" />
              {
      <button
        key="1M"
        onClick={() => handleSelect("1M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '80px', left: '120px' }}
      >
        1M
      </button>

      <button
        key="2M"
        onClick={() => handleSelect("2M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '110px', left: '170px' }}
      >
        2M
      </button>

      <button
        key="3M"
        onClick={() => handleSelect("3M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '140px', left: '220px' }}
      >
        3M
      </button>

      <button
        key="4M"
        onClick={() => handleSelect("4M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '170px', left: '270px' }}
      >
        4M
      </button>

      <button
        key="5M"
        onClick={() => handleSelect("5M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '200px', left: '320px' }}
      >
        5M
      </button>

      <button
        key="6M"
        onClick={() => handleSelect("6M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '230px', left: '370px' }}
      >
        6M
      </button>

      <button
        key="7M"
        onClick={() => handleSelect("7M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '260px', left: '420px' }}
      >
        7M
      </button>

      <button
        key="17M"
        onClick={() => handleSelect("17M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '300px', left: '100px' }}
      >
        17M
      </button>

      <button
        key="18M"
        onClick={() => handleSelect("18M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '330px', left: '150px' }}
      >
        18M
      </button>

      <button
        key="19M"
        onClick={() => handleSelect("19M")}
        className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
        style={{ top: '360px', left: '200px' }}
      >
        19M
      </button>

              <button
                  key={site}
                  onClick={() => handleSelect(site)}
                  className="absolute bg-yellow-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-yellow-400"
                  style={{
                    top: `${Math.random() * 300}px`,
                    left: `${Math.random() * 300}px`,
                  }}
                >
                  {site}
                </button>
              ))}
            </div>
          
      <button
        key="C8"
        onClick={() => handleSelect("C8")}
        className="absolute bg-blue-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-blue-400"
        style={{ top: '400px', left: '300px' }}
      >
        C8
      </button>

      <button
        key="C9"
        onClick={() => handleSelect("C9")}
        className="absolute bg-blue-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-blue-400"
        style={{ top: '430px', left: '350px' }}
      >
        C9
      </button>

      <button
        key="76"
        onClick={() => handleSelect("76")}
        className="absolute bg-blue-300 border border-black text-xs px-1 py-0.5 rounded hover:bg-blue-400"
        style={{ top: '460px', left: '400px' }}
      >
        76
      </button>
    </div>

          <div>
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
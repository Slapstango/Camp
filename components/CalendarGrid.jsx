import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { format, addDays } from 'date-fns';


const reservableSites = ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '17M', '18M', '19M'];

export default function CalendarGrid({ startDate, endDate }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReservations();
    }
  }, [startDate, endDate]);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('site_id, start_date, end_date');

    if (!error) setReservations(data);
  };

  const getDates = () => {
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }
    return dates;
  };

  const isReserved = (site, date) => {
    return reservations.some(r => {
      return r.site_id === site &&
        new Date(r.start_date) <= date &&
        new Date(r.end_date) >= date;
    });
  };

  const dates = getDates();

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-gray-200">Site</th>
            {dates.map((d, i) => (
              <th key={i} className="border px-2 py-1 bg-gray-100">
                {format(d, 'MM/dd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservableSites.map(site => (
            <tr key={site}>
              <td className="border px-2 py-1 font-bold">{site}</td>
              {dates.map((date, idx) => (
                <td key={idx} className={`border px-2 py-1 ${isReserved(site, date) ? 'bg-red-200' : 'bg-green-100'}`}>
                  {isReserved(site, date) ? 'X' : '✓'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { format, addDays } from 'date-fns';

const reservableSites = [
  '1M','2M','3M','4M','5M','6M','7M',
  '17M','18M','19M','C8','C9','76'
];

export default function CalendarGrid({ startDate, endDate, onView }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      (async () => {
        const { data, error } = await supabase
          .from('reservations')
          .select('id, site_id, start_date, end_date');
        if (error) console.error('Error loading reservations', error);
        else setReservations(data);
      })();
    }
  }, [startDate, endDate]);

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

  const dates = getDates();

  return (
    <div className="overflow-x-auto mb-4">
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
              {dates.map((date, idx) => {
                const resObj = reservations.find(r =>
                  r.site_id === site &&
                  new Date(r.start_date) <= date &&
                  new Date(r.end_date) >= date
                );
                const cellClass = resObj ? 'bg-red-200' : 'bg-green-100';
                return (
                  <td key={idx} className={`border px-2 py-1 ${cellClass}`}>
                    {resObj && onView && (
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => onView(resObj.id)}
                      >
                        View
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);
}
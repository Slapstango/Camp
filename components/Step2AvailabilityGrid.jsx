import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { format, addDays } from 'date-fns';

const reservableSites = ['1M','2M','3M','4M','5M','6M','7M','17M','18M','19M'];

export default function Step2AvailabilityGrid({ startDate, endDate, selectedSite, onSelect }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      (async () => {
        const { data, error } = await supabase
          .from('reservations')
          .select('site_id, start_date, end_date');
        if (error) console.error('Error loading reservations', error);
        else setReservations(data);
      })();
    }
  }, [startDate, endDate]);

  const getDates = () => {
    const dates = [];
    let curr = new Date(startDate);
    const end = new Date(endDate);
    while (curr <= end) {
      dates.push(new Date(curr));
      curr = addDays(curr, 1);
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
            {dates.map((d,i)=>(
              <th key={i} className="border px-2 py-1 bg-gray-100">{format(d,'MM/dd')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservableSites.map(site=>(
            <tr key={site}>
              <td className="border px-2 py-1 font-bold">{site}</td>
              {dates.map((date,idx)=>{
                const r = reservations.find(res =>
                  res.site_id===site &&
                  new Date(res.start_date)<=date &&
                  new Date(res.end_date)>=date
                );
                const cellClass = r ? 'bg-red-200' : 'bg-green-100';
                return (
                  <td key={idx} className={`border px-2 py-1 ${cellClass}`}>
                    {r
                      ? <span className="text-sm text-gray-700">Reserved</span>
                      : <button
                          className="text-sm text-blue-600 hover:underline"
                          onClick={() => onSelect(site)}
                        >
                          Select
                        </button>
                    }
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
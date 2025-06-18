import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import CalendarGrid from './CalendarGrid';

export default function Step2AvailabilityGrid({
  reservation = {},
  setReservation,
  nextStep,
  prevStep,
}) {
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(reservation.siteId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(
      '%c[Step2] Checking availability for:',
      'color: teal; font-weight: bold;',
      reservation.startDate,
      reservation.endDate
    );

    if (reservation.startDate && reservation.endDate) {
      fetchAvailableSites();
    } else {
      setLoading(false);
    }
  }, [reservation.startDate, reservation.endDate]);

  const fetchAvailableSites = async () => {
    console.log(
      '%c[Step2] Fetching existing reservations…',
      'color: purple; font-weight: bold;'
    );

    setLoading(true);

    const { data, error } = await supabase
      .from('reservations')
      .select('site_id, start_date, end_date')
      .not('end_date', 'lt', reservation.startDate)
      .not('start_date', 'gt', reservation.endDate);

    console.log(
      '%c[Step2] Fetched reservations:',
      'color: purple;',
      data,
      'error:',
      error
    );

    if (error) {
      console.error('%c[Step2] Error fetching reservations:', 'color: red;', error);
      setAvailableSites([]);
    } else {
      const reserved = new Set(data.map((r) => r.site_id));
      const filtered = reservableSites.filter((site) => !reserved.has(site));
      console.log(
        '%c[Step2] Available sites after filter:',
        'color: green;',
        filtered
      );
      setAvailableSites(filtered);
    }

    setLoading(false);
  };

  // …rest of your render
}

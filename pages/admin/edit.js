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

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      (async () => {
        const { data, error } = await supabase
          .from('reservations')
          .select('*, guests(*)')
          .eq('id', id)
          .single();
        if (!error) {
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
    }
  }, [id]);

  if (loading || !reservation) return <p>Loading...</p>;

  // ... rest of edit form ...
  return <p>Edit form here</p>;
}
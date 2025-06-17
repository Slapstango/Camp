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

  // ... rest of edit form ...
  return <p>Edit form here</p>;
}
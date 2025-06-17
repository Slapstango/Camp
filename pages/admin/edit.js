import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';

export default function EditReservationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [reservation, setReservation] = useState({
    siteId: '', startDate: '', endDate: '',
    primaryName:'', age:'', email:'', phone:'',
    stayType:'', unitLength:'', guests:[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      (async () => {
        const { data, error } = await supabase
          .from('reservations').select('*,guests(*)').eq('id',id).single();
        if (!error) {
          setReservation({
            siteId:data.site_id, startDate:data.start_date, endDate:data.end_date,
            primaryName:data.primary_name, age:String(data.age),
            email:data.email, phone:data.phone,
            stayType:data.stay_type, unitLength:data.unit_length?String(data.unit_length):'',
            guests:data.guests.map(g=>({name:g.name, age:String(g.age)}))
          });
        }
        setLoading(false);
      })();
    }
  },[id]);

  const handleChange=(k,v)=>setReservation({...reservation,[k]:v});
  const handleGuestChange=(i,k,v)=>{
    const g=reservation.guests.slice(); g[i][k]=v; setReservation({...reservation,guests:g});
  };

  const handleSave=async()=>{
    setSaving(true);
    setMessage('');
    await supabase.from('reservations').update({
      site_id:reservation.siteId, start_date:reservation.startDate, end_date:reservation.endDate,
      primary_name:reservation.primaryName, age:Number(reservation.age),
      email:reservation.email, phone:reservation.phone, stay_type:reservation.stayType,
      unit_length:reservation.unitLength?Number(reservation.unitLength):null,
      guest_count:reservation.guests.length
    }).eq('id',id);
    await supabase.from('guests').delete().eq('reservation_id',id);
    if(reservation.guests.length){
      await supabase.from('guests').insert(reservation.guests.map(g=>({
        reservation_id:id, name:g.name, age:Number(g.age)
      })));
    }
    setMessage('Reservation saved successfully.');
    setSaving(false);
  };

  if(loading) return <p>Loading...</p>;
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Edit Reservation #{id}</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {/* Fields */}
      <div className="space-y-4">
        <div><label>Site</label><input value={reservation.siteId} onChange={e=>handleChange('siteId',e.target.value)} className="block border p-1 w-full"/></div>
        <div><label>Start Date</label><input type="date" value={reservation.startDate} onChange={e=>handleChange('startDate',e.target.value)} className="block border p-1 w-full"/></div>
        <div><label>End Date</label><input type="date" value={reservation.endDate} onChange={e=>handleChange('endDate',e.target.value)} className="block border p-1 w-full"/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Name</label><input value={reservation.primaryName} onChange={e=>handleChange('primaryName',e.target.value)} className="block border p-1 w-full"/></div>
          <div><label>Age</label><input type="number" value={reservation.age} onChange={e=>handleChange('age',e.target.value)} className="block border p-1 w-full"/></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Email</label><input type="email" value={reservation.email} onChange={e=>handleChange('email',e.target.value)} className="block border p-1 w-full"/></div>
          <div><label>Phone</label><input value={reservation.phone} onChange={e=>handleChange('phone',e.target.value)} className="block border p-1 w-full"/></div>
        </div>
        <div><label>Stay Type</label><select value={reservation.stayType} onChange={e=>handleChange('stayType',e.target.value)} className="block border p-1 w-full">
          <option value="">Select</option><option value="Tent">Tent</option><option value="Travel Trailer">Trailer</option><option value="Class A">Class A</option><option value="Class B">Class B</option><option value="Class C">Class C</option><option value="Cabin">Cabin</option>
        </select></div>
        {['Travel Trailer','Class A','Class B','Class C'].includes(reservation.stayType) && <div><label>Unit Length</label><input type="number" value={reservation.unitLength} onChange={e=>handleChange('unitLength',e.target.value)} className="block border p-1 w-full"/></div>}
        <div><label>Guests (Name and Age, comma separated pairs)</label><textarea value={reservation.guests.map(g=>g.name+':'+g.age).join(',')} onChange={e=>{
          const arr=e.target.value.split(',').map(s=>s.trim()); const gs=arr.map(item=>{const [n,a]=item.split(':'); return {name:n||'', age:a||''}}); handleChange('guests',gs);
        }} className="block border p-1 w-full" rows="3"/></div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={() => router.push('/admin')} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">Back to Admin</button>
      </div>
    </div>
  );
}

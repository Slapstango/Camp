import Head from 'next/head';
import ReservationForm from '../components/ReservationForm';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Campground Reservation</title>
        <meta name="description" content="Make your reservation for the campground" />
      </Head>
      <main className="min-h-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8">Campground Reservation</h1>
        <ReservationForm />
      </main>
    </div>
  );
}
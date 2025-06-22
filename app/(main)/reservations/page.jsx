import { getUserTestDrives } from '@/action/test-drive';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ReservationList from './_components/reservations-list';

export const metadata = {
    title: "My Reservation | Vehicle",
    description: "Manage your test drive reservations",
}

const ReservationPage = async () => {

    const {userId} = await auth();
    if(!userId) {
        redirect('/sign-in?redirect=/reservations');
    }

    const reservationsResult = await getUserTestDrives();

    return (
        <div className='container mx-auto px-4 py-12'>
            <h1 className='text-6xl mb-6 gradient-title'>Your Reservations</h1>
            <ReservationList initialData={reservationsResult} />
        </div>
    )
}

export default ReservationPage;
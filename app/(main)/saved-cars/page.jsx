import { getSavedCars } from '@/action/car-listing';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/dist/server/api-utils';
import React from 'react'
import SavedCarsList from './_components/saved-cars-list';

const SavedCarsPage = async() => {
    
    const {userId} = await auth();
    if(!userId){
        redirect("/sign-in?redirect=/saved-cars");  // first directed to sign in page the directed to save cars
    }

    const savedCarsRessult = await getSavedCars();

  return (
    <div className='container mx-auto px-4 py-12'>
        <h1 className='text-6xl mb-6 gradient-title'>Your Saved Cars</h1>
        <SavedCarsList initialData={savedCarsRessult} />
    </div>
  )
}

export default SavedCarsPage
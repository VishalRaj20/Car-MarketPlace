import { getCarFilters } from '@/action/car-listing';
import React from 'react'
import CarFilters from './_components/car-filter';
import {CarListings} from './_components/car-listing';

export const metadata = {
    title: "Cars | Vehicle",
    description: "Browse and search for your dream car",
};

const CarsPage = async() => {

    const filtersData = await getCarFilters();
    return (
        <div className='container mx-auto py-10 p-4'>
            <h1 className='text-6xl mb-4 gradient-title'>Browse Cars</h1>

            <div className='flex flex-col lg:flex-row gap-8'>
                <div className='w-full lg:w-80 flex-shrink-0'>
                    {/* Filters */}
                    <CarFilters filters={filtersData.data} />
                </div>
                <div className='flex-1'>
                    {/* {Listing} */}
                    <CarListings />
                </div>
            </div>
        </div>
    )
}

export default CarsPage;
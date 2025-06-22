
import React from 'react'
import CarsList from './_components/car-list';

// to show on top 
export const metadata ={
    title: "Cars | Vehicle Admin",
    description: "Manage cars in your marketPlace",
};

const CarsPage = () => {
  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold mb-6'> cars Management</h1>
        <CarsList />
    </div>
  )
}

export default CarsPage
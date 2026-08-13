import React from 'react'
import SettingForm from './_components/settings-form';

export const metadata ={
    title: "Settings | Vehicle Admin",
    description: "Manage dealership working hours and admin users",
};

const SettingPage = () => {
  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold mb-6'>SettingPage</h1>
        <SettingForm />
    </div>
  )
}

export default SettingPage
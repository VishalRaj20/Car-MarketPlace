import { getDashBoardData } from '@/action/admin';
import React from 'react'
import DashBoard from './_components/dashboard';

export const metaData = {
  title: "Dashboard | Vehicle Admin",
  description: "Admin dashboard for Vehicle car marketplace",
};

const AdminPage = async() => {

  const dashboardData = await getDashBoardData();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>DashBoard </h1>
      <DashBoard initialData={dashboardData}/>
    </div>
  )
}

export default AdminPage;
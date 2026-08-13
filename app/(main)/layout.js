import React from 'react'

const MainLayout = ({children}) => {
  return (
    <div className='container mx-auto px-4 md:px-6 pt-24 pb-12'>{children}</div>
  )
}

export default MainLayout;
import React from 'react'
import AdminHeader from '../admin/AdminHeader'
import Footer from '../Footer'

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <Outlet />
      <Footer />
    </>
  )
}

export default AdminLayout
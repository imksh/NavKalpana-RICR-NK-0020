import React from 'react'
import AdminHeader from '../admin/AdminHeader'
import Footer from '../Footer'
import { Outlet } from 'react-router-dom'

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
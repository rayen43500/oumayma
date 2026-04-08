import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../admin/AdminNavbar.jsx';

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
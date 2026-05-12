import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminHero from './pages/AdminHero';
import AdminEvents from './pages/AdminEvents';
import AdminFacilities from './pages/AdminFacilities';
import AdminServices from './pages/AdminServices';
import AdminUsers from './pages/AdminUsers';
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="hero" element={<AdminHero />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;

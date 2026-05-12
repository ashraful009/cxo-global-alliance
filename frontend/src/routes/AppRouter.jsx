import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner/LoadingSpinner';

// Pages
import Home from '../pages/Home';
import Events from '../pages/Events';
import Services from '../pages/Services';
import Facilities from '../pages/Facilities';
import About from '../pages/About';
import Membership from '../pages/Membership';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound/NotFound';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><LoadingSpinner /></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><LoadingSpinner /></div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><LoadingSpinner /></div>;

  if (user) return <Navigate to="/profile" replace />;

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/services" element={<Services />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/about" element={<About />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      
      {/* Own profile — any logged-in user */}
      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      {/* Other member's profile — access control handled inside Profile */}
      <Route
        path="/profile/:userId"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      
      {/* Admin Route */}
      <Route 
        path="/admin/*" 
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } 
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

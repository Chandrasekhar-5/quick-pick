import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import VendorLayout from './components/vendor/VendorLayout.tsx';
import VendorDashboard from './pages/VendorDashboard.tsx';
import VendorOrders from './pages/VendorOrders.tsx';
import VendorMenu from './pages/VendorMenu.tsx';
import VendorAnalytics from './pages/VendorAnalytics.tsx';
import VendorProfile from './pages/VendorProfile.tsx';
import VendorSettings from './pages/VendorSettings.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={
            <ProtectedRoute>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<VendorDashboard />} />
            <Route path="/orders" element={<VendorOrders />} />
            <Route path="/menu" element={<VendorMenu />} />
            <Route path="/analytics" element={<VendorAnalytics />} />
            <Route path="/profile" element={<VendorProfile />} />
            <Route path="/settings" element={<VendorSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

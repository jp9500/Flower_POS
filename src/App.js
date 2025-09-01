import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/footer';
import Master from './pages/master';
import Transaction from './pages/transaction';
import Report from './pages/report';
import Login from './pages/login';
import Signup from './pages/signup';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* <Navbar /> */}

      <main style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/master" element={
            <ProtectedRoute><Master /></ProtectedRoute>
          } />
          <Route path="/transaction" element={
            <ProtectedRoute><Transaction /></ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute><Report /></ProtectedRoute>
          } />
        </Routes>
      </main>

      <ToastContainer position="bottom-center" autoClose={1000} />

      {/* Footer only after login */}
      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

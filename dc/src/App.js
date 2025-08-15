import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import People from './pages/People.jsx';              // ▶ add
import UserPage from './pages/User.jsx';              // ▶ add
import MyReviews from './pages/MyReviews.jsx';        // ▶ add

export default function App() {
  return (
    <>
      <nav>
        {/* <Link to="/">Home</Link> */}
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/people">People</Link>           {/* ▶ add */}
        <Link to="/my/reviews">My Reviews</Link>   {/* ▶ add */}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />   {/* ▶ add */}
        <Route path="/user/:id" element={<ProtectedRoute><UserPage /></ProtectedRoute>} /> {/* ▶ add */}
        <Route path="/my/reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} /> {/* ▶ add */}
        <Route path="*" element={<div className="container">Not Found</div>} />
      </Routes>
    </>
  );
}
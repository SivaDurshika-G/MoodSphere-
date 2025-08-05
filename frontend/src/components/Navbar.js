// frontend/src/components/Navbar.js
import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  return (
    <nav className="navbar">
      <h1>MoodSphere</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        {token ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
        <li><Link to="/privacy">Privacy</Link></li>
        <li><Link to="/terms">Terms</Link></li>
      </ul>
    </nav>
  );
}

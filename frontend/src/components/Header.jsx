import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ cartItemsCount }) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <h1>🛒 Micro E-Commerce</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Products</Link>
          <Link to="/cart">
            Cart
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
          <div className="auth-nav">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">Hello, {user?.name}!</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-nav-link">
                  Login
                </Link>
                <Link to="/register" className="auth-nav-link register-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

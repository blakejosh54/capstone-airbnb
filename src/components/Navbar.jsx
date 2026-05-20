import "../css/Navbar.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const showSearch =
    location.pathname === "/locations" ||
    location.pathname === "/accommodations" ||
    /^\/accommodations\/[^/]+$/.test(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <header
      className={`${isHomePage ? "navbar navbar-dark" : "navbar navbar-light"} ${
        isAuthPage ? "navbar-auth" : ""
      }`}
    >
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="" className="navbar-logo-image" />
        <span className="navbar-logo-text">airbnb</span>
      </Link>

      {!isAuthPage && (
        <nav className="navbar-center">
          {showSearch ? (
            <SearchBar variant="navbar-version" />
          ) : (
            <>
              <Link to="/accommodations">Places to stay</Link>
              <a href="#">Experiences</a>
              <a href="#">Online Experiences</a>
            </>
          )}
        </nav>
      )}

      <div className="navbar-right">
        {currentUser ? (
          <Link to="/admin/listings">
            Welcome, {currentUser.name || "Host"}
          </Link>
        ) : (
          <Link to="/login">Become a host</Link>
        )}

        <button type="button" className="globe-button">
          <i className="material-icons">language</i>
        </button>

        <div className="menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-lines">☰</span>
            <span className="default-profile-icon">
              <i className="material-icons">person</i>
            </span>
          </button>

          {menuOpen && (
            <div className="navbar-dropdown">
              {currentUser ? (
                <>
                  <Link to="/admin/listings" onClick={() => setMenuOpen(false)}>
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/my-reservations"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Reservations
                  </Link>

                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>

                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

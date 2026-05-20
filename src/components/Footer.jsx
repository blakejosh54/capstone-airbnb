import { useLocation } from "react-router-dom";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (hideFooter) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-column">
          <h3>Support</h3>
          <p>Help Center</p>
          <p>Safety information</p>
          <p>Cancellation options</p>
          <p>Our COVID-19 Response</p>
          <p>Supporting people with disabilities</p>
          <p>Report a neighborhood concern</p>
        </div>

        <div className="footer-column">
          <h3>Community</h3>
          <p>Airbnb.org: disaster relief housing</p>
          <p>Support Afghan refugees</p>
          <p>Combatting discrimination</p>
          <p>Join the LGBTQ+ community</p>
          <p>Guest Referrals</p>
          <p>Gift cards</p>
        </div>

        <div className="footer-column">
          <h3>Hosting</h3>
          <p>Try hosting</p>
          <p>AirCover: protection for Hosts</p>
          <p>Explore hosting resources</p>
          <p>Visit our community forum</p>
          <p>How to host responsibly</p>
          <p>Host an online experience</p>
        </div>

        <div className="footer-column">
          <h3>About</h3>
          <p>Newsroom</p>
          <p>Learn about new features</p>
          <p>Letter from our founders</p>
          <p>Careers</p>
          <p>Investors</p>
          <p>Airbnb Luxe</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <span>© 2026 Blake Airbnb Clone</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Sitemap</span>
        </div>

        <div className="footer-settings">
          <i className="material-icons footer-icon">language</i>

          <select>
            <option>English</option>
          </select>

          <select>
            <option>ZAR</option>
          </select>

          <i className="material-icons footer-icon">facebook</i>
          <FaTwitter className="footer-react-icon" />
          <FaInstagram className="footer-react-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

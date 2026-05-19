import { Link } from "react-router-dom";
import "../css/HostDashboard.css";

function HostNav() {
  return (
    <div className="host-nav">
      <Link to="/admin/view-reservations" className="host-pill">
        View Reservations
      </Link>

      <Link to="/admin/listings" className="host-pill">
        View Listings
      </Link>

      <Link to="/admin/create-listing" className="host-pill">
        Create Listing
      </Link>
    </div>
  );
}

export default HostNav;

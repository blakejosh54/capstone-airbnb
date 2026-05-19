import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HostNav from "../components/HostNav";
import "../css/HostDashboard.css";

function MyListings() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function fetchMyListings() {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/accommodations/my-listings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not load listings.");
        setLoading(false);
        return;
      }

      setListings(data);
    } catch (error) {
      console.log("Failed to load listings", error);
      setMessage("Something went wrong while loading listings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/accommodations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not delete listing.");
        return;
      }

      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== id),
      );
    } catch (error) {
      console.log("Failed to delete listing", error);
      setMessage("Something went wrong while deleting the listing.");
    }
  }

  useEffect(() => {
    fetchMyListings();
  }, []);

  return (
    <main className="host-page">
      <HostNav />

      <h1 className="host-title">My Listings</h1>

      {message && <p className="host-message">{message}</p>}

      {loading ? (
        <p className="host-message">Loading listings...</p>
      ) : listings.length === 0 ? (
        <section className="host-empty-state">
          <h2>No listings yet</h2>
          <p>Create your first stay so guests can start booking.</p>

          <Link to="/admin/create-listing" className="primary-button">
            Create Listing
          </Link>
        </section>
      ) : (
        <section className="listing-list">
          {listings.map((listing) => (
            <article
              key={listing._id}
              className="host-listing-card"
              onClick={() => navigate(`/accommodations/${listing._id}`)}
            >
              <div className="host-listing-left">
                <img
                  src={
                    listing.images && listing.images.length > 0
                      ? listing.images[0]
                      : "https://placehold.co/500x300?text=No+Image"
                  }
                  alt={listing.title}
                  className="host-listing-image"
                />

                <Link
                  to={`/admin/update-listing/${listing._id}`}
                  className="host-update-button"
                  onClick={(event) => event.stopPropagation()}
                >
                  Update
                </Link>

                <button
                  className="host-delete-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(listing._id);
                  }}
                >
                  Delete
                </button>
              </div>

              <div className="host-listing-info">
                <p className="listing-type-location">
                  {listing.type} - {listing.location}
                </p>

                <h2>{listing.title}</h2>

                <div className="small-divider"></div>

                <p>
                  {listing.guests} guests - {listing.type} - {listing.bedrooms}{" "}
                  bedrooms - {listing.bathrooms} bathrooms
                </p>

                <p>
                  Amenities:{" "}
                  {listing.amenities && listing.amenities.length > 0
                    ? listing.amenities.join(", ")
                    : "No amenities listed"}
                </p>

                <div className="small-divider"></div>

                <p>
                  {listing.rating > 0 && listing.reviews > 0 ? (
                    <>
                      ⭐ {listing.rating} ({listing.reviews} reviews)
                    </>
                  ) : (
                    <>No reviews</>
                  )}
                </p>

                <p className="host-fees-preview">
                  Cleaning fee: R{listing.cleaningFee || 0} · Service fee: R
                  {listing.serviceFee || 0} · Taxes: R
                  {listing.occupancyTaxes || 0}
                </p>
              </div>

              <div className="host-listing-price">
                <h3>R{listing.price}/night</h3>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyListings;

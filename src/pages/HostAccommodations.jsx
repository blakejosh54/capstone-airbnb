import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../css/HostAccommodations.css";

const HostAccommodations = () => {
  const [hostAccommodations, setHostAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  if (!token || !currentUser) {
    return <Navigate to="/login" />;
  }

  // gets all accommodations and filters the ones owned by the logged-in user
  useEffect(() => {
    const getHostAccommodations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/accommodations",
        );
        const data = await response.json();

        const myAccommodations = data.filter((accommodation) => {
          const ownerId = accommodation.owner?._id || accommodation.owner;

          return ownerId === currentUser.id || ownerId === currentUser._id;
        });

        setHostAccommodations(myAccommodations);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch host accommodations", error);
        setLoading(false);
      }
    };

    getHostAccommodations();
  }, [currentUser.id, currentUser._id]);

  if (loading) {
    return (
      <p className="page-message">Loading your hosted accommodations...</p>
    );
  }

  return (
    <main className="host-page">
      <div className="host-header">
        <h1>Your hosted accommodations</h1>
        <p>Manage the stays that you created.</p>
      </div>

      {hostAccommodations.length === 0 ? (
        <div className="empty-host-box">
          <h2>You have not created any accommodations yet.</h2>
        </div>
      ) : (
        <div className="host-list">
          {hostAccommodations.map((accommodation) => (
            <div className="host-card" key={accommodation._id}>
              <img
                src={
                  accommodation.images?.length > 0
                    ? accommodation.images[0]
                    : "https://placehold.co/600x400?text=Airbnb+Stay"
                }
                alt={accommodation.title}
                className="host-card-image"
              />

              <div className="host-card-info">
                <h2>{accommodation.title}</h2>
                <p>{accommodation.location}</p>
                <p>
                  {accommodation.guests} guests · {accommodation.bedrooms}{" "}
                  bedrooms · {accommodation.bathrooms} bathrooms
                </p>
                <p>
                  <strong>R{accommodation.price}</strong> / night
                </p>

                <Link
                  to={`/accommodations/${accommodation._id}`}
                  className="host-view-link"
                >
                  View listing
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default HostAccommodations;

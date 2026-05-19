import "../css/Accommodations.css";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Accommodations = () => {
  const [searchParams] = useSearchParams();

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedLocation = searchParams.get("location") || "";
  const adults = Number(searchParams.get("adults")) || 0;
  const children = Number(searchParams.get("children")) || 0;
  const guestCount = adults + children;

  const getLocationName = (location) => {
    if (!location) {
      return "";
    }

    return location.split(",")[0].trim();
  };

  const filteredAccommodations = accommodations.filter((accommodation) => {
    const accommodationLocation = getLocationName(accommodation.location);
    const matchesLocation = selectedLocation
      ? accommodationLocation.toLowerCase() === selectedLocation.toLowerCase()
      : true;
    const matchesGuests =
      guestCount > 0 ? accommodation.guests >= guestCount : true;

    return matchesLocation && matchesGuests;
  });

  useEffect(() => {
    const getAccommodations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/accommodations",
        );
        const data = await response.json();

        setAccommodations(data);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch accommodations", error);
        setLoading(false);
      }
    };

    getAccommodations();
  }, []);

  if (loading) {
    return <p className="page-message">Loading accommodations...</p>;
  }

  return (
    <main className="accommodations-page">
      <h2>
        {selectedLocation
          ? `${filteredAccommodations.length} stays in ${selectedLocation}`
          : `${filteredAccommodations.length} stays in all locations`}
      </h2>

      {filteredAccommodations.length === 0 ? (
        <p>No accommodations found.</p>
      ) : (
        <div className="accommodation-list">
          {filteredAccommodations.map((accommodation) => (
            <Link
              to={`/accommodations/${accommodation._id}`}
              className="accommodation-card-link"
              key={accommodation._id}
            >
              <div className="accommodation-card">
                <img
                  src={
                    accommodation.images?.length > 0
                      ? accommodation.images[0]
                      : "https://placehold.co/600x400?text=Airbnb+Stay"
                  }
                  alt={accommodation.title}
                  className="accommodation-card-image"
                />

                <div className="accommodation-card-info">
                  <p className="accommodation-type">{accommodation.type}</p>
                  <h3>{accommodation.title}</h3>

                  <div className="small-line"></div>

                  <p className="accommodation-details">
                    {accommodation.guests} guests · {accommodation.type} ·{" "}
                    {accommodation.bedrooms} bedrooms ·{" "}
                    {accommodation.bathrooms} bathrooms
                  </p>

                  <p className="accommodation-details">
                    Wifi · Kitchen · Free parking
                  </p>

                  <p className="rating">
                    {accommodation.rating > 0 && accommodation.reviews > 0 ? (
                      <>
                        ★ {accommodation.rating} · {accommodation.reviews}{" "}
                        reviews
                      </>
                    ) : (
                      <>No reviews</>
                    )}
                  </p>
                </div>

                <div className="accommodation-card-price">
                  <p>
                    <strong>R{accommodation.price}</strong> / night
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default Accommodations;

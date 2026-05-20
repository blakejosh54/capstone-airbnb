import "../css/Accommodations.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const defaultAmenities = ["Wifi", "Kitchen", "Free parking"];

const Accommodations = () => {
  const [searchParams] = useSearchParams();

  // stores the listings and filter values
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // reads search values from the URL
  const selectedLocation = searchParams.get("location") || "";
  const locationSearch = searchParams.get("search") || "";
  const adults = Number(searchParams.get("adults")) || 0;
  const children = Number(searchParams.get("children")) || 0;
  const guestCount = adults + children;

  // formats listing details for display
  const getLocationName = (location) => {
    if (!location) {
      return "";
    }

    return location.split(",")[0].trim();
  };

  const getAmenities = (amenities) => {
    if (amenities?.length > 0) {
      return amenities.join(" · ");
    }

    return defaultAmenities.join(" · ");
  };

  const getAmenityList = (amenities) => {
    if (amenities?.length > 0) {
      return amenities;
    }

    return defaultAmenities;
  };

  // turns amenity filters on and off
  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter(
          (selectedAmenity) => selectedAmenity !== amenity,
        ),
      );
      return;
    }

    setSelectedAmenities([...selectedAmenities, amenity]);
  };

  // applies the selected filters
  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((accommodation) => {
      const accommodationLocation = getLocationName(accommodation.location);
      const accommodationAmenities = getAmenityList(
        accommodation.amenities,
      ).map((amenity) => amenity.toLowerCase());

      const matchesLocation = selectedLocation
        ? accommodationLocation.toLowerCase() === selectedLocation.toLowerCase()
        : true;
      const matchesSearch = locationSearch
        ? accommodationLocation
            .toLowerCase()
            .startsWith(locationSearch.trim().toLowerCase())
        : true;
      const matchesGuests =
        guestCount > 0 ? accommodation.guests >= guestCount : true;
      const matchesPrice =
        selectedPrice === "under-1000"
          ? accommodation.price < 1000
          : selectedPrice === "1000-1500"
            ? accommodation.price >= 1000 && accommodation.price <= 1500
            : selectedPrice === "over-1500"
              ? accommodation.price > 1500
              : true;
      const matchesType = selectedType
        ? accommodation.type.toLowerCase() === selectedType.toLowerCase()
        : true;
      const matchesAmenities =
        selectedAmenities.length > 0
          ? selectedAmenities.every((amenity) =>
              accommodationAmenities.includes(amenity.toLowerCase()),
            )
          : true;

      return (
        matchesLocation &&
        matchesSearch &&
        matchesGuests &&
        matchesPrice &&
        matchesType &&
        matchesAmenities
      );
    });
  }, [
    accommodations,
    selectedLocation,
    locationSearch,
    guestCount,
    selectedPrice,
    selectedType,
    selectedAmenities,
  ]);

  const hasLocationFilter = selectedLocation || locationSearch;

  // loads all accommodations
  useEffect(() => {
    const getAccommodations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/accommodations`);
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
        {filteredAccommodations.length === 0 && hasLocationFilter
          ? "No locations"
          : selectedLocation
            ? `${filteredAccommodations.length} stays in ${selectedLocation}`
            : locationSearch
              ? `${filteredAccommodations.length} stays matching ${locationSearch}`
              : `${filteredAccommodations.length} stays in all locations`}
      </h2>

      <div className="accommodation-filters">
        <div className="accommodation-filter-select price-filter-select">
          <select
            value={selectedPrice}
            onChange={(event) => setSelectedPrice(event.target.value)}
          >
            <option value="">Price</option>
            <option value="under-1000">Under R1000</option>
            <option value="1000-1500">R1000 - R1500</option>
            <option value="over-1500">Over R1500</option>
          </select>
        </div>

        <div className="accommodation-filter-select type-filter-select">
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            <option value="">Type of place</option>
            <option value="Entire home">Entire home</option>
            <option value="Private room">Private room</option>
            <option value="Shared room">Shared room</option>
            <option value="Hotel room">Hotel room</option>
            <option value="Apartment">Apartment</option>
            <option value="Cabin">Cabin</option>
          </select>
        </div>

        <button
          type="button"
          className={selectedAmenities.includes("Wifi") ? "active-filter" : ""}
          onClick={() => toggleAmenity("Wifi")}
        >
          Wifi
        </button>

        <button
          type="button"
          className={
            selectedAmenities.includes("Kitchen") ? "active-filter" : ""
          }
          onClick={() => toggleAmenity("Kitchen")}
        >
          Kitchen
        </button>

        <button
          type="button"
          className={
            selectedAmenities.includes("Air conditioning")
              ? "active-filter"
              : ""
          }
          onClick={() => toggleAmenity("Air conditioning")}
        >
          Air conditioning
        </button>
      </div>

      {filteredAccommodations.length === 0 ? (
        <p>No locations</p>
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
                  loading="lazy"
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
                    {getAmenities(accommodation.amenities)}
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

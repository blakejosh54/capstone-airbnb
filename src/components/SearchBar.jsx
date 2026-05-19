import "../css/SearchBar.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = ({ variant = "hero" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchBarRef = useRef(null);
  const [searchParams] = useSearchParams();

  const [accommodations, setAccommodations] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");

  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || "",
  );
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 0);
  const [children, setChildren] = useState(
    Number(searchParams.get("children")) || 0,
  );

  const guestCount = adults + children;

  const getTodayDateString = () => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today - timezoneOffset);

    return localToday.toISOString().split("T")[0];
  };

  const getNextDayDateString = (dateString) => {
    if (!dateString) {
      return getTodayDateString();
    }

    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    return date.toISOString().split("T")[0];
  };

  const todayDate = getTodayDateString();
  const minimumCheckOutDate = getNextDayDateString(checkIn);

  const getLocationName = (locationValue) => {
    if (!locationValue) {
      return "";
    }

    return locationValue.split(",")[0].trim();
  };

  const locations = [
    ...new Set(
      accommodations
        .map((accommodation) => getLocationName(accommodation.location))
        .filter((locationName) => locationName),
    ),
  ].sort();

  const buildSearchUrl = (filters = {}) => {
    const nextLocation =
      filters.location !== undefined ? filters.location : selectedLocation;
    const nextCheckIn =
      filters.checkIn !== undefined ? filters.checkIn : checkIn;
    const nextCheckOut =
      filters.checkOut !== undefined ? filters.checkOut : checkOut;
    const nextAdults = filters.adults !== undefined ? filters.adults : adults;
    const nextChildren =
      filters.children !== undefined ? filters.children : children;

    const params = new URLSearchParams();

    if (nextLocation) {
      params.set("location", nextLocation);
    }

    if (nextCheckIn) {
      params.set("checkIn", nextCheckIn);
    }

    if (nextCheckOut) {
      params.set("checkOut", nextCheckOut);
    }

    if (nextAdults > 0) {
      params.set("adults", nextAdults);
    }

    if (nextChildren > 0) {
      params.set("children", nextChildren);
    }

    const queryString = params.toString();

    if (queryString) {
      return `/locations?${queryString}`;
    }

    return "/locations";
  };

  const handleSearch = () => {
    navigate(buildSearchUrl());
    setActiveDropdown("");
  };

  const handleLocationSelect = (locationName) => {
    setSelectedLocation(locationName);
    setActiveDropdown("");
  };

  const handleCheckInChange = (event) => {
    const value = event.target.value;

    setCheckIn(value);

    if (checkOut && new Date(checkOut) <= new Date(value)) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (event) => {
    setCheckOut(event.target.value);
  };

  const increaseAdults = () => {
    setAdults(adults + 1);
  };

  const decreaseAdults = () => {
    if (adults > 0) {
      setAdults(adults - 1);
    }
  };

  const increaseChildren = () => {
    setChildren(children + 1);
  };

  const decreaseChildren = () => {
    if (children > 0) {
      setChildren(children - 1);
    }
  };

  useEffect(() => {
    const getAccommodations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/accommodations",
        );
        const data = await response.json();

        setAccommodations(data);
      } catch (error) {
        console.log("Failed to fetch search locations", error);
      }
    };

    getAccommodations();
  }, []);

  useEffect(() => {
    const urlCheckIn = searchParams.get("checkIn") || "";
    const urlCheckOut = searchParams.get("checkOut") || "";

    setSelectedLocation(searchParams.get("location") || "");
    setCheckIn(urlCheckIn && urlCheckIn >= todayDate ? urlCheckIn : "");
    setCheckOut(urlCheckOut && urlCheckOut >= todayDate ? urlCheckOut : "");
    setAdults(Number(searchParams.get("adults")) || 0);
    setChildren(Number(searchParams.get("children")) || 0);
  }, [location.search, searchParams, todayDate]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setActiveDropdown("");
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <div className={`stay-search-bar ${variant}`} ref={searchBarRef}>
      <div className="stay-search-item">
        <button
          type="button"
          onClick={() =>
            setActiveDropdown(activeDropdown === "location" ? "" : "location")
          }
        >
          <span>Locations</span>
          <small>{selectedLocation || "Select a Location"}</small>
        </button>

        {activeDropdown === "location" && (
          <div className="search-dropdown location-dropdown">
            {locations.length === 0 ? (
              <button type="button">No locations found</button>
            ) : (
              locations.map((locationName) => {
                return (
                  <button
                    type="button"
                    key={locationName}
                    onClick={() => handleLocationSelect(locationName)}
                  >
                    {locationName}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="stay-search-item">
        <button
          type="button"
          onClick={() =>
            setActiveDropdown(activeDropdown === "checkIn" ? "" : "checkIn")
          }
        >
          <span>Check in date</span>
          <small>{checkIn || "Select date"}</small>
        </button>

        {activeDropdown === "checkIn" && (
          <div className="search-dropdown date-dropdown">
            <input
              type="date"
              min={todayDate}
              value={checkIn}
              onChange={handleCheckInChange}
            />
          </div>
        )}
      </div>

      <div className="stay-search-item">
        <button
          type="button"
          onClick={() =>
            setActiveDropdown(activeDropdown === "checkOut" ? "" : "checkOut")
          }
        >
          <span>Checkout date</span>
          <small>{checkOut || "Select date"}</small>
        </button>

        {activeDropdown === "checkOut" && (
          <div className="search-dropdown date-dropdown">
            <input
              type="date"
              min={minimumCheckOutDate}
              value={checkOut}
              onChange={handleCheckOutChange}
            />
          </div>
        )}
      </div>

      <div className="stay-search-item">
        <button
          type="button"
          onClick={() =>
            setActiveDropdown(activeDropdown === "guests" ? "" : "guests")
          }
        >
          <span>Guests</span>
          <small>{guestCount === 1 ? "1 guest" : `${guestCount} guests`}</small>
        </button>

        {activeDropdown === "guests" && (
          <div className="search-dropdown guests-dropdown">
            <div className="guest-row">
              <span>Adults</span>

              <div>
                <button type="button" onClick={decreaseAdults}>
                  -
                </button>
                <strong>{adults}</strong>
                <button type="button" onClick={increaseAdults}>
                  +
                </button>
              </div>
            </div>

            <div className="guest-row">
              <span>Children</span>

              <div>
                <button type="button" onClick={decreaseChildren}>
                  -
                </button>
                <strong>{children}</strong>
                <button type="button" onClick={increaseChildren}>
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="stay-search-button"
        onClick={handleSearch}
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;

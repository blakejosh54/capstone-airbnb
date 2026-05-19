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
  const [searchText, setSearchText] = useState("");

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
  const isNavbarVersion = variant === "navbar-version";
  const isDetailsSearchBar =
    isNavbarVersion && /^\/accommodations\/[^/]+$/.test(location.pathname);

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

    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + 1);

    return date.toISOString().split("T")[0];
  };

  const formatDatePart = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatStayDates = () => {
    if (!checkIn && !checkOut) {
      return "Add dates";
    }

    if (checkIn && !checkOut) {
      return formatDatePart(checkIn);
    }

    if (!checkIn && checkOut) {
      return formatDatePart(checkOut);
    }

    const checkInDate = new Date(`${checkIn}T00:00:00`);
    const checkOutDate = new Date(`${checkOut}T00:00:00`);
    const checkInMonth = checkInDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const checkOutMonth = checkOutDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const checkInDay = checkInDate.getDate();
    const checkOutDay = checkOutDate.getDate();

    if (checkInMonth === checkOutMonth) {
      return `${checkInMonth} ${checkInDay} - ${checkOutDay}`;
    }

    return `${checkInMonth} ${checkInDay} - ${checkOutMonth} ${checkOutDay}`;
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

  const matchingLocations = locations.filter((locationName) =>
    locationName.toLowerCase().startsWith(searchText.trim().toLowerCase()),
  );

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

  const handleNavbarSearch = () => {
    const cleanSearch = searchText.trim();

    if (!cleanSearch) {
      navigate("/locations");
      setActiveDropdown("");
      return;
    }

    navigate(`/locations?search=${encodeURIComponent(cleanSearch)}`);
    setActiveDropdown("");
  };

  const handleNavbarLocationSelect = (locationName) => {
    navigate(`/locations?location=${encodeURIComponent(locationName)}`);
    setSearchText("");
    setActiveDropdown("");
  };

  const handleNavbarKeyDown = (event) => {
    if (event.key === "Enter") {
      handleNavbarSearch();
    }
  };

  const handleLocationSelect = (locationName) => {
    setSelectedLocation(locationName);
    setActiveDropdown("");
  };

  const handleCheckInChange = (event) => {
    const value = event.target.value;

    setCheckIn(value);

    if (
      checkOut &&
      new Date(`${checkOut}T00:00:00`) <= new Date(`${value}T00:00:00`)
    ) {
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

  if (isDetailsSearchBar) {
    return (
      <div
        className={`stay-search-bar ${variant} details-navbar-search`}
        ref={searchBarRef}
      >
        <div className="navbar-location-search">
          <input
            type="text"
            value={searchText}
            placeholder="Start your search"
            onChange={(event) => {
              setSearchText(event.target.value);
              setActiveDropdown("locationSearch");
            }}
            onFocus={() => setActiveDropdown("locationSearch")}
            onKeyDown={handleNavbarKeyDown}
          />

          {activeDropdown === "locationSearch" && searchText.trim() && (
            <div className="search-dropdown navbar-location-dropdown">
              {matchingLocations.length === 0 ? (
                <p>No locations</p>
              ) : (
                matchingLocations.map((locationName) => {
                  return (
                    <button
                      type="button"
                      key={locationName}
                      onClick={() => handleNavbarLocationSelect(locationName)}
                    >
                      {locationName}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="stay-search-button"
          onClick={handleNavbarSearch}
        >
          🔍
        </button>
      </div>
    );
  }

  if (isNavbarVersion) {
    return (
      <div className={`stay-search-bar ${variant}`} ref={searchBarRef}>
        <div className="stay-search-item">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown(activeDropdown === "location" ? "" : "location")
            }
          >
            <small>{selectedLocation || "All locations"}</small>
          </button>

          {activeDropdown === "location" && (
            <div className="search-dropdown location-dropdown">
              <button type="button" onClick={() => handleLocationSelect("")}>
                All locations
              </button>

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
              setActiveDropdown(activeDropdown === "dates" ? "" : "dates")
            }
          >
            <small>{formatStayDates()}</small>
          </button>

          {activeDropdown === "dates" && (
            <div className="search-dropdown date-dropdown navbar-date-dropdown">
              <label>
                Check in
                <input
                  type="date"
                  min={todayDate}
                  value={checkIn}
                  onChange={handleCheckInChange}
                />
              </label>

              <label>
                Check out
                <input
                  type="date"
                  min={minimumCheckOutDate}
                  value={checkOut}
                  onChange={handleCheckOutChange}
                />
              </label>
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
            <small>
              {guestCount === 1 ? "1 guest" : `${guestCount} guests`}
            </small>
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
  }

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
          <small>{selectedLocation || "All locations"}</small>
        </button>

        {activeDropdown === "location" && (
          <div className="search-dropdown location-dropdown">
            <button type="button" onClick={() => handleLocationSelect("")}>
              All locations
            </button>

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

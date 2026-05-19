import "../css/AccommodationDetails.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import superhostBadge from "../assets/superhost.svg";

const staticReviews = [
  {
    name: "Alice",
    date: "March 2023",
    text: "Amazing place, very clean and well-located.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
  },
  {
    name: "Bob",
    date: "February 2023",
    text: "Great communication with the host and easy check-in process.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
  },
  {
    name: "Carol",
    date: "January 2023",
    text: "The apartment was exactly as described. Highly recommend.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120",
  },
  {
    name: "Dave",
    date: "December 2022",
    text: "Fantastic stay. The location is perfect.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
  },
  {
    name: "Eve",
    date: "November 2022",
    text: "Very clean and spacious. Would definitely come back.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120",
  },
  {
    name: "Frank",
    date: "October 2022",
    text: "Excellent value for the price. Loved the neighbourhood.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
  },
];

const staticAmenities = [
  "Garden view",
  "Wifi",
  "Free washer - in building",
  "Air conditioning",
  "Refrigerator",
  "Kitchen",
  "Pets allowed",
  "Dryer",
  "Security cameras",
  "Free parking",
];

const bedroomImageUrl =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80";

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

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

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const timeDifference = endDate - startDate;
    const nights = timeDifference / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return 0;
    }

    return nights;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Select date";
    }

    return new Date(dateString).toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getMonthName = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();

    return date.toLocaleDateString("en-ZA", {
      month: "long",
      year: "numeric",
    });
  };

  const getLocationName = () => {
    if (!accommodation?.location) {
      return "this stay";
    }

    return accommodation.location.split(",")[0];
  };

  const getCalendarDays = (dateString) => {
    const baseDate = dateString ? new Date(dateString) : new Date();

    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push("");
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isSelectedCalendarDay = (day, dateString) => {
    if (!day || !dateString) {
      return false;
    }

    const date = new Date(dateString);

    return date.getDate() === day;
  };

  const todayDate = getTodayDateString();
  const minimumCheckOutDate = getNextDayDateString(checkIn);

  const nights = calculateNights();

  const price = accommodation?.price || 0;
  const weeklyDiscount = 0;
  const cleaningFee = accommodation?.cleaningFee || 0;
  const serviceFee = accommodation?.serviceFee || 0;
  const occupancyTaxes = accommodation?.occupancyTaxes || 0;

  const nightlyTotal = nights * price;
  const totalPrice =
    nightlyTotal - weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes;

  const rating = accommodation?.rating || 0;
  const reviews = accommodation?.reviews || 0;
  const hasReviews = rating > 0 && reviews > 0;

  const hostAvatarUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(
    accommodation?.host || "airbnb-host",
  )}`;

  const handleCheckInChange = (event) => {
    const selectedCheckIn = event.target.value;

    setCheckIn(selectedCheckIn);
    setMessage("");

    if (checkOut && new Date(checkOut) <= new Date(selectedCheckIn)) {
      setCheckOut("");
    }
  };

  const handleCheckOutChange = (event) => {
    setCheckOut(event.target.value);
    setMessage("");
  };

  const handleGuestsChange = (event) => {
    const selectedGuests = Number(event.target.value);

    setGuests(selectedGuests);
    setMessage("");
  };

  const handleClearDates = () => {
    setCheckIn("");
    setCheckOut("");
    setMessage("");
  };

  const handleReserve = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      setMessage("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(checkIn) < new Date(todayDate)) {
      setMessage("Check-in date cannot be in the past.");
      return;
    }

    if (nights <= 0) {
      setMessage("Check-out date must be after check-in date.");
      return;
    }

    if (guests < 1) {
      setMessage("Guests must be at least 1.");
      return;
    }

    if (guests > accommodation.guests) {
      setMessage(`This stay only allows ${accommodation.guests} guests.`);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accommodation: id,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create reservation.");
        return;
      }

      setMessage("Reservation created successfully!");

      setTimeout(() => {
        navigate("/my-reservations");
      }, 1000);
    } catch (error) {
      console.log("Failed to create reservation", error);
      setMessage("Something went wrong while creating your reservation.");
    }
  };

  useEffect(() => {
    const getAccommodation = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/accommodations/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setAccommodation(null);
          setLoading(false);
          return;
        }

        setAccommodation(data);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch accommodation", error);
        setLoading(false);
      }
    };

    getAccommodation();
  }, [id]);

  if (loading) {
    return <p className="page-message">Loading accommodation...</p>;
  }

  if (!accommodation) {
    return <p className="page-message">Accommodation not found.</p>;
  }

  return (
    <main className="details-page">
      <div className="details-container">
        <Link to="/accommodations" className="back-link">
          Back to all stays
        </Link>

        <section className="details-header">
          <div>
            <h1>{accommodation.title}</h1>

            <p>
              {hasReviews ? (
                <>
                  ★ {rating} · {reviews} reviews · {accommodation.location}
                </>
              ) : (
                <>{accommodation.location}</>
              )}
            </p>
          </div>

          <div className="details-actions">
            <button type="button">↗ Share</button>
            <button type="button">♡ Save</button>
          </div>
        </section>

        <section className="image-gallery">
          <img
            src={
              accommodation.images?.length > 0
                ? accommodation.images[0]
                : "https://placehold.co/900x600?text=Airbnb+Stay"
            }
            alt={accommodation.title}
            className="main-gallery-image"
          />

          <div className="side-gallery">
            <img
              src={
                accommodation.images?.[1] ||
                "https://placehold.co/500x300?text=Stay+Image"
              }
              alt="Accommodation"
            />

            <img
              src={
                accommodation.images?.[2] ||
                "https://placehold.co/500x300?text=Stay+Image"
              }
              alt="Accommodation"
            />

            <img
              src={
                accommodation.images?.[3] ||
                "https://placehold.co/500x300?text=Stay+Image"
              }
              alt="Accommodation"
            />

            <img
              src={
                accommodation.images?.[4] ||
                "https://placehold.co/500x300?text=Stay+Image"
              }
              alt="Accommodation"
            />
          </div>
        </section>

        <section className="details-layout">
          <div className="details-left">
            <section className="details-section intro-section">
              <div>
                <h2>
                  {accommodation.type} hosted by {accommodation.host || "Host"}
                </h2>

                <p className="details-muted">
                  {accommodation.guests} guests · {accommodation.type} ·{" "}
                  {accommodation.bedrooms} bedrooms · {accommodation.bathrooms}{" "}
                  bathrooms
                </p>
              </div>

              <div className="host-avatar-wrapper host-avatar-wrapper-small">
                <img
                  src={hostAvatarUrl}
                  alt="Host"
                  className="host-mini-avatar"
                />
                <img
                  src={superhostBadge}
                  alt="Superhost"
                  className="host-superhost-badge"
                />
              </div>
            </section>

            <section className="details-section feature-list">
              <div className="feature-row">
                <span className="feature-icon">⌂</span>
                <div>
                  <h3>{accommodation.type}</h3>
                  <p>You’ll have the accommodation to yourself.</p>
                </div>
              </div>

              {accommodation.enhancedCleaning && (
                <div className="feature-row">
                  <span className="feature-icon">✣</span>
                  <div>
                    <h3>Enhanced cleaning</h3>
                    <p>
                      This host is committed to a clean and comfortable stay.
                    </p>
                  </div>
                </div>
              )}

              {accommodation.selfCheckIn && (
                <div className="feature-row">
                  <span className="feature-icon">⇱</span>
                  <div>
                    <h3>Self check-in</h3>
                    <p>Check yourself in when you arrive.</p>
                  </div>
                </div>
              )}

              <div className="feature-row">
                <span className="feature-icon">▣</span>
                <div>
                  <h3>Free cancellation before your trip</h3>
                  <p>Cancel before your trip starts.</p>
                </div>
              </div>
            </section>

            <section className="details-section">
              <p className="description-text">{accommodation.description}</p>
            </section>

            <section className="details-section">
              <h2>Where you’ll sleep</h2>

              <div className="sleep-card">
                <img src={bedroomImageUrl} alt="Bedroom" />

                <p>Spacious bedroom with comfortable bed.</p>
                <p>Total bedrooms: {accommodation.bedrooms}</p>
              </div>
            </section>

            <section className="details-section">
              <h2>What this place offers</h2>

              <div className="amenities-grid">
                {staticAmenities.map((amenity, index) => {
                  return (
                    <p key={index}>
                      <span>◇</span>
                      {amenity}
                    </p>
                  );
                })}
              </div>

              <button className="outline-button">
                View all {staticAmenities.length} amenities
              </button>
            </section>

            <section className="details-section calendar-section">
              <h2>
                {nights > 0
                  ? `${nights} days in ${getLocationName()}`
                  : `Select dates in ${getLocationName()}`}
              </h2>

              <p className="details-muted">
                {checkIn && checkOut
                  ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
                  : "Choose your check-in and check-out dates."}
              </p>

              <div className="calendar-preview-grid">
                <div className="calendar-box">
                  <div className="calendar-month">
                    <button type="button">‹</button>
                    <strong>{getMonthName(checkIn || todayDate)}</strong>
                    <button type="button">›</button>
                  </div>

                  <div className="calendar-weekdays">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="calendar-days">
                    {getCalendarDays(checkIn || todayDate).map((day, index) => {
                      return (
                        <span
                          key={index}
                          className={
                            isSelectedCalendarDay(day, checkIn)
                              ? "selected-calendar-day"
                              : ""
                          }
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="calendar-box">
                  <div className="calendar-month">
                    <button type="button">‹</button>
                    <strong>
                      {getMonthName(checkOut || minimumCheckOutDate)}
                    </strong>
                    <button type="button">›</button>
                  </div>

                  <div className="calendar-weekdays">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="calendar-days">
                    {getCalendarDays(checkOut || minimumCheckOutDate).map(
                      (day, index) => {
                        return (
                          <span
                            key={index}
                            className={
                              isSelectedCalendarDay(day, checkOut)
                                ? "selected-calendar-day"
                                : ""
                            }
                          >
                            {day}
                          </span>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="clear-dates-button"
                onClick={handleClearDates}
              >
                Clear dates
              </button>
            </section>

            {hasReviews && (
              <section className="details-section reviews-section">
                <h2>
                  ★ {rating} · {reviews} reviews
                </h2>

                <div className="rating-bars">
                  <div>
                    <span>Cleanliness</span>
                    <div className="rating-bar">
                      <div style={{ width: `${(rating / 5) * 100}%` }}></div>
                    </div>
                    <strong>{rating}</strong>
                  </div>

                  <div>
                    <span>Accuracy</span>
                    <div className="rating-bar">
                      <div style={{ width: "94%" }}></div>
                    </div>
                    <strong>4.7</strong>
                  </div>

                  <div>
                    <span>Communication</span>
                    <div className="rating-bar">
                      <div style={{ width: "96%" }}></div>
                    </div>
                    <strong>4.8</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <div className="rating-bar">
                      <div style={{ width: "98%" }}></div>
                    </div>
                    <strong>4.9</strong>
                  </div>

                  <div>
                    <span>Check-in</span>
                    <div className="rating-bar">
                      <div style={{ width: "92%" }}></div>
                    </div>
                    <strong>4.6</strong>
                  </div>

                  <div>
                    <span>Value</span>
                    <div className="rating-bar">
                      <div style={{ width: "90%" }}></div>
                    </div>
                    <strong>4.5</strong>
                  </div>
                </div>

                <div className="review-grid">
                  {staticReviews.map((review) => {
                    return (
                      <article className="review-card" key={review.name}>
                        <div className="review-person">
                          <img src={review.image} alt={review.name} />
                          <div>
                            <h3>{review.name}</h3>
                            <p>{review.date}</p>
                          </div>
                        </div>

                        <p>{review.text}</p>
                      </article>
                    );
                  })}
                </div>

                <button className="outline-button">
                  Show all {reviews} reviews
                </button>
              </section>
            )}

            <section className="details-section host-section">
              <div className="host-profile-row">
                <div className="host-avatar-wrapper host-avatar-wrapper-large">
                  <img
                    src={hostAvatarUrl}
                    alt="Host"
                    className="host-avatar-large"
                  />
                  <img
                    src={superhostBadge}
                    alt="Superhost"
                    className="host-superhost-badge"
                  />
                </div>

                <div>
                  <h2>Hosted by {accommodation.host || "Host"}</h2>
                  <p>Joined June 2024</p>
                </div>
              </div>

              <div className="host-badges">
                <span>★ {reviews} Reviews</span>
                <span>✓ Identity verified</span>
                <span>🏅 Superhost</span>
              </div>

              <h3>{accommodation.host || "This host"} is a superhost</h3>

              <p>
                Superhosts are experienced, highly rated hosts who are committed
                to providing great stays for guests.
              </p>

              <p>Response rate: 100%</p>
              <p>Response time: within an hour</p>

              <button className="outline-button">Contact Host</button>

              <p className="payment-warning">
                🛡 To protect your payment, never transfer money or communicate
                outside of the Airbnb website or app.
              </p>
            </section>
          </div>

          <div className="booking-sidebar">
            <aside className="booking-card">
              <div className="booking-top">
                <p>
                  <strong>R{price}</strong> / night
                </p>

                {hasReviews ? (
                  <p>
                    ★ {rating} · {reviews} reviews
                  </p>
                ) : (
                  <p className="new-listing-label">No reviews</p>
                )}
              </div>

              <div className="booking-inputs">
                <div>
                  <label>Check-in</label>
                  <input
                    type="date"
                    min={todayDate}
                    value={checkIn}
                    onChange={handleCheckInChange}
                  />
                </div>

                <div>
                  <label>Check-out</label>
                  <input
                    type="date"
                    min={minimumCheckOutDate}
                    value={checkOut}
                    onChange={handleCheckOutChange}
                  />
                </div>

                <div className="guest-input">
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={accommodation.guests}
                    value={guests}
                    onChange={handleGuestsChange}
                  />
                </div>
              </div>

              <button className="reserve-button" onClick={handleReserve}>
                Reserve
              </button>

              {message && <p className="booking-message">{message}</p>}

              <p className="booking-note">You won’t be charged yet</p>

              <div className="price-summary">
                <p>
                  <span>
                    R{price} x {nights} nights
                  </span>
                  <span>R{nightlyTotal}</span>
                </p>

                <p>
                  <span>Weekly discount</span>
                  <span>-R{weeklyDiscount}</span>
                </p>

                <p>
                  <span>Cleaning fee</span>
                  <span>R{cleaningFee}</span>
                </p>

                <p>
                  <span>Service fee</span>
                  <span>R{serviceFee}</span>
                </p>

                <p>
                  <span>Occupancy taxes and fees</span>
                  <span>R{occupancyTaxes}</span>
                </p>

                <hr />

                <p className="total-line">
                  <span>Total</span>
                  <span>R{totalPrice}</span>
                </p>
              </div>
            </aside>

            <button type="button" className="report-listing-button">
              ⚐ Report this listing
            </button>
          </div>
        </section>

        <section className="rules-section">
          <div>
            <h2>House Rules</h2>

            <p>
              <span>•</span> Check-in: After 4:00 PM
            </p>

            <p>
              <span>•</span> Check-out: 10:00 AM
            </p>

            <p>
              <span>•</span> Self check-in with lock-box
            </p>

            <p>
              <span>•</span> Not suitable for infants under 2 years
            </p>

            <p>
              <span>•</span> No smoking
            </p>

            <p>
              <span>•</span> No pets
            </p>

            <p>
              <span>•</span> No parties or events
            </p>
          </div>

          <div>
            <h2>Health & Safety</h2>

            <p>
              <span>•</span> Committed to Airbnb’s enhanced cleaning process.
            </p>

            <p>
              <span>•</span> Airbnb’s social-distancing and other COVID-19
              guidelines apply.
            </p>

            <p>
              <span>•</span> Carbon monoxide alarm
            </p>

            <p>
              <span>•</span> Smoke alarm
            </p>

            <p>
              <span>•</span> Security Deposit - if you damage the home, you may
              be charged.
            </p>

            <button className="text-button">Show more</button>
          </div>

          <div>
            <h2>Cancellation Policy</h2>

            <p>
              <span>•</span> Free cancellation before your trip starts.
            </p>

            <button className="text-button">Show more</button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AccommodationDetails;

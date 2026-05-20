import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/MyReservations.css";

const MyReservations = () => {
  // stores the user reservations
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // loads the user bookings
  useEffect(() => {
    const getMyReservations = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:5000/api/reservations/my-reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch reservations.");
          setLoading(false);
          return;
        }

        setReservations(data);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch reservations", error);
        setMessage("Something went wrong while fetching your reservations.");
        setLoading(false);
      }
    };

    getMyReservations();
  }, []);

  // cancels a booking
  const handleCancelReservation = async (reservationId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservationId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to cancel reservation.");
        return;
      }

      setReservations((currentReservations) =>
        currentReservations.map((reservation) => {
          if (reservation._id === reservationId) {
            return {
              ...reservation,
              status: data.reservation.status,
            };
          }

          return reservation;
        }),
      );

      setMessage("Reservation cancelled successfully.");
    } catch (error) {
      console.log("Failed to cancel reservation", error);
      setMessage("Something went wrong while cancelling your reservation.");
    }
  };

  if (loading) {
    return (
      <main className="my-reservations-page">
        <p className="page-message">Loading your reservations...</p>
      </main>
    );
  }

  return (
    <main className="my-reservations-page">
      <section className="my-reservations-header">
        <h1>My Reservations</h1>
        <p>View the stays you have booked.</p>
      </section>

      {message && <p className="reservation-message">{message}</p>}

      {reservations.length === 0 ? (
        <section className="empty-reservations">
          <h2>No reservations yet</h2>
          <p>When you book a stay, it will show up here.</p>
          <Link to="/accommodations">Start exploring</Link>
        </section>
      ) : (
        <section className="reservation-list">
          {reservations.map((reservation) => {
            return (
              <article className="reservation-card" key={reservation._id}>
                <img
                  src={
                    reservation.accommodation?.images?.length > 0
                      ? reservation.accommodation.images[0]
                      : "https://placehold.co/500x300?text=Reservation"
                  }
                  alt={reservation.accommodation?.title || "Accommodation"}
                />

                <div className="reservation-info">
                  <h2>{reservation.accommodation?.title}</h2>

                  <p className="reservation-location">
                    {reservation.accommodation?.location}
                  </p>

                  <div className="reservation-details-grid">
                    <p className="reservation-detail">
                      <span>Check-in</span>
                      {new Date(reservation.checkIn).toLocaleDateString()}
                    </p>

                    <p className="reservation-detail">
                      <span>Check-out</span>
                      {new Date(reservation.checkOut).toLocaleDateString()}
                    </p>

                    <p className="reservation-detail">
                      <span>Guests</span>
                      {reservation.guests}
                    </p>

                    <p className="reservation-detail">
                      <span>Total</span>R{reservation.totalPrice}
                    </p>
                  </div>

                  <p
                    className={
                      reservation.status === "cancelled"
                        ? "reservation-status cancelled"
                        : "reservation-status"
                    }
                  >
                    {reservation.status}
                  </p>

                  <br />

                  {reservation.status !== "cancelled" && (
                    <button
                      className="cancel-reservation-button"
                      onClick={() => handleCancelReservation(reservation._id)}
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default MyReservations;

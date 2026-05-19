import { useEffect, useState } from "react";
import HostNav from "../components/HostNav";
import "../css/HostDashboard.css";

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getHostReservations = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:5000/api/reservations/host-reservations",
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
        console.log("Failed to fetch host reservations", error);
        setMessage("Something went wrong while fetching reservations.");
        setLoading(false);
      }
    };

    getHostReservations();
  }, []);

  if (loading) {
    return (
      <main className="host-page">
        <HostNav />
        <p>Loading reservations...</p>
      </main>
    );
  }

  return (
    <main className="host-page">
      <HostNav />

      <section className="host-header">
        <h1>View Reservations</h1>
        <p>See bookings made for your listings.</p>
      </section>

      {message && <p>{message}</p>}

      {reservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <div className="host-table-wrapper">
          <table className="host-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Property</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((reservation) => {
                return (
                  <tr key={reservation._id}>
                    <td>
                      {reservation.user?.name || "Guest"}
                      <br />
                      <small>{reservation.user?.email}</small>
                    </td>

                    <td>{reservation.accommodation?.title}</td>

                    <td>
                      {new Date(reservation.checkIn).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(reservation.checkOut).toLocaleDateString()}
                    </td>

                    <td>{reservation.guests}</td>

                    <td>R{reservation.totalPrice}</td>

                    <td>{reservation.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default ViewReservations;

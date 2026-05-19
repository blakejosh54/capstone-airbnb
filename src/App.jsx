import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Accommodations from "./pages/Accommodations.jsx";
import AccommodationDetails from "./pages/AccommodationDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyListings from "./pages/MyListings.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";
import ViewReservations from "./pages/ViewReservations.jsx";
import MyReservations from "./pages/MyReservations";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";

const App = () => {
  const GuestRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (token) {
      return <Navigate to="/admin/listings" />;
    }

    return children;
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locations" element={<Accommodations />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/accommodations/:id" element={<AccommodationDetails />} />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-listing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/update-listing/:id"
          element={
            <ProtectedRoute>
              <UpdateListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/view-reservations"
          element={
            <ProtectedRoute>
              <ViewReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/host-accommodations"
          element={<Navigate to="/admin/listings" />}
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;

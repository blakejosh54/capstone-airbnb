import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HostNav from "../components/HostNav";
import "../css/HostDashboard.css";

function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    type: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
    cleaningFee: "",
    serviceFee: "",
    occupancyTaxes: "",
    description: "",
    enhancedCleaning: false,
    selfCheckIn: false,
    amenities: ["Wifi", "Kitchen", "Free parking"],
    amenityInput: "",
    images: [],
    imageInput: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function addAmenity() {
    const cleanAmenity = formData.amenityInput.trim();

    if (!cleanAmenity) return;

    setFormData((prevData) => ({
      ...prevData,
      amenities: [...prevData.amenities, cleanAmenity],
      amenityInput: "",
    }));
  }

  function removeAmenity(index) {
    setFormData((prevData) => ({
      ...prevData,
      amenities: prevData.amenities.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function addImage() {
    const cleanImage = formData.imageInput.trim();

    if (!cleanImage) return;

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, cleanImage],
      imageInput: "",
    }));
  }

  async function uploadImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage("");

      const token = localStorage.getItem("token");
      const imageData = new FormData();

      imageData.append("image", file);

      const response = await fetch(`${API_URL}/api/accommodations/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not upload image.");
        setUploadingImage(false);
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, data.imageUrl],
      }));
    } catch (error) {
      setMessage("Something went wrong while uploading the image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function removeImage(index) {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const accommodationData = {
        title: formData.title,
        price: Number(formData.price),
        type: formData.type,
        location: formData.location,
        guests: Number(formData.guests),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        cleaningFee: Number(formData.cleaningFee) || 0,
        serviceFee: Number(formData.serviceFee) || 0,
        occupancyTaxes: Number(formData.occupancyTaxes) || 0,
        description: formData.description,
        enhancedCleaning: formData.enhancedCleaning,
        selfCheckIn: formData.selfCheckIn,
        amenities: formData.amenities,
        images: formData.images,
      };

      const response = await fetch(`${API_URL}/api/accommodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accommodationData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not create listing.");
        setLoading(false);
        return;
      }

      navigate("/admin/listings");
    } catch (error) {
      setMessage("Something went wrong while creating the listing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="host-page">
      <HostNav />

      <h1 className="host-title">Create Listing</h1>

      {message && <p className="host-message">{message}</p>}

      <form className="listing-form" onSubmit={handleSubmit}>
        <div className="form-left">
          <label>
            Listing Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select a location</option>
              <option value="Paris">Paris</option>
              <option value="Cape Town">Cape Town</option>
              <option value="London">London</option>
              <option value="New York">New York</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Bali">Bali</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                name="enhancedCleaning"
                checked={formData.enhancedCleaning}
                onChange={handleChange}
              />
              Enhanced Cleaning
            </label>

            <label>
              <input
                type="checkbox"
                name="selfCheckIn"
                checked={formData.selfCheckIn}
                onChange={handleChange}
              />
              Self Check-In
            </label>
          </div>

          <label>
            Amenities
            <div className="inline-input">
              <input
                type="text"
                name="amenityInput"
                value={formData.amenityInput}
                onChange={handleChange}
              />
              <button type="button" onClick={addAmenity}>
                Add
              </button>
            </div>
          </label>

          <div className="tag-list">
            {formData.amenities.map((amenity, index) => (
              <button
                type="button"
                key={`${amenity}-${index}`}
                className="tag"
                onClick={() => removeAmenity(index)}
              >
                {amenity} ×
              </button>
            ))}
          </div>
        </div>

        <div className="form-right">
          <div className="top-fields">
            <label>
              Price
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select an option</option>
                <option value="Entire home">Entire home</option>
                <option value="Private room">Private room</option>
                <option value="Shared room">Shared room</option>
                <option value="Hotel room">Hotel room</option>
              </select>
            </label>
          </div>

          <div className="number-fields">
            <label>
              Guests
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Bedrooms
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Bathrooms
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="fee-fields">
            <label>
              Cleaning Fee
              <input
                type="number"
                name="cleaningFee"
                value={formData.cleaningFee}
                onChange={handleChange}
              />
            </label>

            <label>
              Service Fee
              <input
                type="number"
                name="serviceFee"
                value={formData.serviceFee}
                onChange={handleChange}
              />
            </label>

            <label>
              Occupancy Taxes
              <input
                type="number"
                name="occupancyTaxes"
                value={formData.occupancyTaxes}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Image URL
            <div className="inline-input">
              <input
                type="text"
                name="imageInput"
                value={formData.imageInput}
                onChange={handleChange}
                placeholder="Paste image URL"
              />
              <button type="button" onClick={addImage}>
                Add
              </button>
            </div>
          </label>

          <label>
            Upload Image
            <input type="file" accept="image/*" onChange={uploadImage} />
          </label>

          {uploadingImage && <p className="host-message">Uploading image...</p>}

          <div className="image-upload-box">
            {formData.images.length === 0 ? (
              <p>No images uploaded</p>
            ) : (
              formData.images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => removeImage(index)}
                >
                  Image {index + 1} ×
                </button>
              ))
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={() => navigate("/admin/listings")}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;

import "../css/Home.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import logo from "../assets/logo.svg";

const Home = () => {
  const [activeGetawayTab, setActiveGetawayTab] = useState(0);

  return (
    <main className="home-page">
      <section className="hero-section">
        <SearchBar variant="hero" />

        <div className="hero-image">
          <h1>Not sure where to go? Perfect.</h1>

          <Link to="/accommodations" className="hero-button">
            Explore stays
          </Link>
        </div>
      </section>

      <section className="home-section">
        <h2>Inspiration for your next trip</h2>

        <div className="inspiration-grid">
          <Link to="/locations?location=Cape%20Town" className="trip-card">
            <div className="trip-image cape-town"></div>

            <div className="trip-content">
              <h3>Cape Town</h3>
              <p>15 kilometers away</p>
            </div>
          </Link>

          <Link to="/locations?location=Stellenbosch" className="trip-card">
            <div className="trip-image stellenbosch"></div>

            <div className="trip-content">
              <h3>Stellenbosch</h3>
              <p>50 kilometers away</p>
            </div>
          </Link>

          <Link to="/locations?location=Camps%20Bay" className="trip-card">
            <div className="trip-image camps-bay"></div>

            <div className="trip-content">
              <h3>Camps Bay</h3>
              <p>7 kilometers away</p>
            </div>
          </Link>

          <Link to="/locations?location=Drakensberg" className="trip-card">
            <div className="trip-image drakensberg"></div>

            <div className="trip-content">
              <h3>Drakensberg</h3>
              <p>1,200 kilometers away</p>
            </div>
          </Link>

          <Link to="/locations?location=New%20York" className="trip-card">
            <div className="trip-image new-york"></div>

            <div className="trip-content">
              <h3>New York</h3>
              <p>12,500 kilometers away</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="experiences-section">
        <h2>Discover Airbnb Experiences</h2>

        <div className="experience-grid">
          <div className="experience-card experience-trip">
            <h3>Things to do on your trip</h3>
            <button>Experiences</button>
          </div>

          <div className="experience-card experience-home">
            <h3>Things to do from home</h3>
            <button>Online Experiences</button>
          </div>
        </div>
      </section>

      <section className="gift-card-section">
        <div>
          <h2>
            Shop Airbnb
            <br />
            gift cards
          </h2>
          <button type="button">Learn more</button>
        </div>

        <div className="gift-card-images">
          <div className="gift-card gift-card-left">
            <img src={logo} alt="Airbnb" className="gift-airbnb-logo" />
          </div>

          <div className="gift-card gift-card-center">
            <img src={logo} alt="Airbnb" className="gift-airbnb-logo" />
          </div>

          <div className="gift-card gift-card-right">
            <img src={logo} alt="Airbnb" className="gift-airbnb-logo" />
          </div>
        </div>
      </section>

      <section className="hosting-section">
        <div>
          <h2>Questions about hosting?</h2>
          <Link to="/accommodations" className="hosting-button">
            Explore hosting
          </Link>
        </div>
      </section>

      <section className="future-getaways-section">
        <h2>Inspiration for future getaways</h2>

        <div className="getaway-tabs">
          {getawayTabs.map((tab, index) => {
            return (
              <button
                type="button"
                key={tab.name}
                className={activeGetawayTab === index ? "active-tab" : ""}
                onClick={() => setActiveGetawayTab(index)}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="getaway-grid">
          {getawayTabs[activeGetawayTab].places.map((place) => {
            return (
              <div key={`${place.title}-${place.location}`}>
                <h3>{place.title}</h3>
                <p>{place.location}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

const getawayTabs = [
  {
    name: "Destinations for arts and culture",
    places: [
      { title: "Eiffel Tower", location: "Paris, France" },
      { title: "Statue of Liberty", location: "New York, USA" },
      { title: "Shibuya Crossing", location: "Tokyo, Japan" },
      { title: "Big Ben", location: "London, UK" },
      { title: "Colosseum", location: "Rome, Italy" },
      { title: "Sydney Opera House", location: "Sydney, Australia" },
      { title: "Table Mountain", location: "Cape Town, South Africa" },
      { title: "Sagrada Familia", location: "Barcelona, Spain" },
      { title: "Great Wall", location: "Beijing, China" },
      { title: "Christ the Redeemer", location: "Rio de Janeiro, Brazil" },
      { title: "Santorini", location: "Santorini, Greece" },
      { title: "Grand Canyon", location: "Arizona, USA" },
    ],
  },
  {
    name: "Destinations for outdoor adventure",
    places: [
      { title: "Lake District", location: "England, United Kingdom" },
      { title: "Queenstown", location: "Otago, New Zealand" },
      { title: "Banff", location: "Alberta, Canada" },
      { title: "Moab", location: "Utah, USA" },
      { title: "Interlaken", location: "Bern, Switzerland" },
      { title: "Drakensberg", location: "South Africa" },
      { title: "Patagonia", location: "Argentina" },
      { title: "Yosemite", location: "California, USA" },
      { title: "Dolomites", location: "Italy" },
      { title: "Madeira", location: "Portugal" },
      { title: "Reykjavik", location: "Iceland" },
      { title: "Sedona", location: "Arizona, USA" },
    ],
  },
  {
    name: "Mountain cabins",
    places: [
      { title: "Aspen", location: "Colorado, USA" },
      { title: "Zermatt", location: "Valais, Switzerland" },
      { title: "Blue Ridge", location: "Georgia, USA" },
      { title: "Chamonix", location: "France" },
      { title: "Lake Tahoe", location: "California, USA" },
      { title: "Whistler", location: "British Columbia, Canada" },
      { title: "Hakuba", location: "Nagano, Japan" },
      { title: "Snowdonia", location: "Wales, United Kingdom" },
      { title: "Mount Hood", location: "Oregon, USA" },
      { title: "Stellenbosch", location: "South Africa" },
      { title: "Bansko", location: "Bulgaria" },
      { title: "Grindelwald", location: "Switzerland" },
    ],
  },
  {
    name: "Beach destinations",
    places: [
      { title: "Camps Bay", location: "Cape Town, South Africa" },
      { title: "Bali", location: "Indonesia" },
      { title: "Maldives", location: "South Asia" },
      { title: "Phuket", location: "Thailand" },
      { title: "Tulum", location: "Mexico" },
      { title: "Maui", location: "Hawaii, USA" },
      { title: "Mykonos", location: "Greece" },
      { title: "Zanzibar", location: "Tanzania" },
      { title: "Ibiza", location: "Spain" },
      { title: "Gold Coast", location: "Australia" },
      { title: "Seychelles", location: "East Africa" },
      { title: "Durban", location: "South Africa" },
    ],
  },
  {
    name: "Popular destinations",
    places: [
      { title: "Cape Town", location: "South Africa" },
      { title: "New York", location: "USA" },
      { title: "London", location: "United Kingdom" },
      { title: "Paris", location: "France" },
      { title: "Dubai", location: "United Arab Emirates" },
      { title: "Tokyo", location: "Japan" },
      { title: "Barcelona", location: "Spain" },
      { title: "Rome", location: "Italy" },
      { title: "Amsterdam", location: "Netherlands" },
      { title: "Bangkok", location: "Thailand" },
      { title: "Los Angeles", location: "California, USA" },
      { title: "Lisbon", location: "Portugal" },
    ],
  },
  {
    name: "Unique stays",
    places: [
      { title: "Treehouse", location: "Hogsback, South Africa" },
      { title: "Tiny home", location: "Portland, USA" },
      { title: "A-frame cabin", location: "Norway" },
      { title: "Desert dome", location: "Joshua Tree, USA" },
      { title: "Houseboat", location: "Amsterdam, Netherlands" },
      { title: "Castle stay", location: "Scotland, United Kingdom" },
      { title: "Cave suite", location: "Santorini, Greece" },
      { title: "Safari tent", location: "Kruger, South Africa" },
      { title: "Glass cabin", location: "Iceland" },
      { title: "Farm stay", location: "Stellenbosch, South Africa" },
      { title: "Lighthouse", location: "Maine, USA" },
      { title: "Ryokan", location: "Kyoto, Japan" },
    ],
  },
];

export default Home;

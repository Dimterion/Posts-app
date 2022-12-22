import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import fullTime from "../assets/jpg/fullTime.jpg";
import freelance from "../assets/jpg/freelance.jpg";

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Programming Offers</p>
      </header>
      <main>
        <Slider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/freelance">
            <img
              src={freelance}
              alt="freelance"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Freelance</p>
          </Link>
          <Link to="/category/full-time">
            <img
              src={fullTime}
              alt="full-time"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Full-Time</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;

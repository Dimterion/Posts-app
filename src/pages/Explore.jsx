import { Link } from "react-router-dom";
import categoryImage from "../assets/jpg/img-forest.jpg";

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/post">
            <img
              src={categoryImage}
              alt="Road in the forest"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Posts</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Helmet>
        <title>{listing.name}</title>
      </Helmet>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.regularPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.details}</p>
        <p className="listingType">
          {listing.type === "freelance" ? "Freelance" : "Full-Time"}
        </p>
        <ul className="listingDetailsList">
          <li>
            {listing.experience > 1
              ? `Experience: ${listing.experience} years`
              : "Experience: 1 year"}
          </li>
          <li>{listing.remote && "Remote"}</li>
          <li>{listing.beginnerFriendly && "Beginner-friendly"}</li>
        </ul>
        <p className="listingLocationTitle">Details</p>
        <p>{listing.details}</p>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;

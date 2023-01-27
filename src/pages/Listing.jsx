import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { getDoc, doc } from "firebase/firestore";
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

  document.title = listing.name;

  return (
    <main>
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
        {listing.regularPrice > 0 ? (
          <p className="listingName">
            {listing.name}{" "}
            {listing.regularPrice !== 0 &&
              `- ${listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ / Month`}
          </p>
        ) : (
          <p className="listingName">{listing.name}</p>
        )}
        <p className="listingType">
          {listing.type === "freelance" ? "Freelance" : "Full-Time"}
        </p>
        <ul className="listingDetailsList">
          <li>
            {listing.experience !== 0 &&
              (listing.experience > 1
                ? `Experience: ${listing.experience} years`
                : "Experience: 1 year")}
            {listing.experience === 0 && `Experience: Junior position`}
          </li>
          <li>{listing.remote && "Remote"}</li>
          <li>{listing.beginnerFriendly && "Beginner-friendly"}</li>
        </ul>
        <p className="listingLocationTitle">Details</p>
        <p>{listing.details}</p>
        <p className="listingLinkTitle">Link</p>
        <a
          className="listingLink"
          href={`${listing.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {listing.link}
        </a>
        <p></p>
      </div>
    </main>
  );
}

export default Listing;

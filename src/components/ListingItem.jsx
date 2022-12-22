import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imgUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.details}</p>
          <p className="categoryListingName">{listing.name}</p>

          <p className="categoryListingPrice">
            ${listing.type === "freelance" && " / Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <p className="categoryListingInfoText">
              {listing.experience > 1
                ? `Experience: ${listing.experience} years`
                : "Experience: 1 year"}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76,60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    </li>
  );
}

export default ListingItem;

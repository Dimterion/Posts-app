import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../components/Spinner";

function CreateListing() {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "freelance",
    name: "",
    link: "",
    experience: 1,
    remote: true,
    beginnerFriendly: true,
    details: "",
    regularPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    link,
    experience,
    remote,
    beginnerFriendly,
    details,
    regularPrice,
    images,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (images.length > 2) {
      setLoading(false);
      toast.error("Max 2 images");
      return;
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,

      timestamp: serverTimestamp(),
    };

    formDataCopy.details = details;
    delete formDataCopy.images;
    delete formDataCopy.details;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Freelance / Full-Time</label>
          <div className="formButtons">
            <button
              type="button"
              className={
                type === "full-time" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="full-time"
              onClick={onMutate}
            >
              Full-Time
            </button>
            <button
              type="button"
              className={
                type === "freelance" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="freelance"
              onClick={onMutate}
            >
              Freelance
            </button>
          </div>
          <label className="formLabel">Position</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="30"
            minLength="10"
            required
          />
          <div className="formRooms flex">
            <div>
              <label className="formLabel">Experience</label>
              <input
                className="formInputSmall"
                type="number"
                id="experience"
                value={experience}
                onChange={onMutate}
                min="0"
                max="100"
                required
              />
            </div>
          </div>
          <label className="formLabel">Remote</label>
          <div className="formButtons">
            <button
              className={remote ? "formButtonActive" : "formButton"}
              type="button"
              id="remote"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !remote && remote !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="remote"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className="formLabel">Beginner-friendly</label>
          <div className="formButtons">
            <button
              className={beginnerFriendly ? "formButtonActive" : "formButton"}
              type="button"
              id="beginnerFriendly"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !beginnerFriendly && beginnerFriendly !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="beginnerFriendly"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className="formLabel">Details</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="details"
            value={details}
            onChange={onMutate}
            required
          />
          <label className="formLabel">Average Salary</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="0"
              max="5000000"
              required
            />
            {type === "freelance" && <p className="formPriceText">$ / Month</p>}
            {type === "full-time" && <p className="formPriceText">$</p>}
          </div>
          <label className="formLabel">Link to the application page</label>
          <input
            className="formInputName"
            type="text"
            id="link"
            value={link}
            onChange={onMutate}
            maxLength="100"
            minLength="5"
            required
          />
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 2).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="2"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;

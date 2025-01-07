"use state";

import "./editProfile.css";
import Backdrop from "@mui/material/Backdrop";
import useProfilePageStore from "@/store/profilePageStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import { createCertification, createDish, createEmployment } from "@/api";
import useAuthStore from "@/store/authStore";
import { refreshUser, uploadImage } from "@/utils/functions";
import { CircularProgress } from "@mui/material";

const AddNewSect = () => {
  const [isCreating, setIsCreating] = useState(false)
  const addSection = useProfilePageStore((state) => state.addSection);
  const setAddSection = useProfilePageStore((state) => state.setAddSection);

  const userInfo = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);


  const handleClose = () => {
    if(isCreating) {
      return
    }
    setAddSection("");
  };

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={addSection}
    >
      <div className="editCompWrapper">
        <CloseOutlinedIcon
          sx={{ fontSize: 30 }}
          onClick={handleClose}
          className="closeIcon"
        />
        {addSection == "dish" && (
          <AddDishComp
            userInfo={userInfo}
            updateUser={updateUser}
            handleClose={handleClose}
            setIsCreating={setIsCreating}
            isCreating={isCreating}
          />
        )}
        {addSection == "employment" && (
          <AddEmploymentComp
            userInfo={userInfo}
            updateUser={updateUser}
            handleClose={handleClose}
            setIsCreating={setIsCreating}
            isCreating={isCreating}
          />
        )}
        {addSection == "certifications" && (
          <AddCertficateComp
            userInfo={userInfo}
            updateUser={updateUser}
            handleClose={handleClose}
            setIsCreating={setIsCreating}
            isCreating={isCreating}
          />
        )}
      </div>
    </Backdrop>
  );
};

export default AddNewSect;


const AddDishComp = ({
  userInfo,
  updateUser,
  handleClose,
  setIsCreating,
  isCreating
}) => {
  const [dishName, setDishName] = useState("");
  const [dishDesc, setDishDesc] = useState("");
  const [dishImages, setDishImages] = useState([]);

  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleImagesChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setDishImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dishImages[0]) return;

    const createDishResponse = await createNewDishFunc();

    setIsCreating(false);
    if (createDishResponse?.status == 500) {
      setEnqueueSnack({ message: createDishResponse?.errorMessage, type: "error" });
      return;
    } else {
      setEnqueueSnack({ message: `New Dish created successfully`, type: "success" });
    }

    refreshUser(userInfo?._id, updateUser, setEnqueueSnack);

    handleClose();
  };

  const createNewDishFunc = async () => {
    setIsCreating(true);

    const firstThreeImages = dishImages.slice(0, 3);

    try {
      setEnqueueSnack({ message: "Uploading your dish images...", type: "info" });

      const imagesURL = await Promise.all(
        firstThreeImages?.map((dishImage) =>
          uploadImage(dishImage, "dishes", setEnqueueSnack)
        )
      );

      if (imagesURL[0]) {
        setEnqueueSnack({ message: "Dish images upload successful.", type: "success" });
      } else {
        return {
          status: 500,
          errorMessage: "Dish image upload failed - try again.",
        };
      }

      const response = await createDish({
        name: dishName,
        description: dishDesc,
        images: imagesURL,
        chef: userInfo?._id, // the chef who created this dish
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  useEffect(() => {
    if (dishImages?.length > 3) {
      setDishImages([]);
    }
  }, [dishImages]);

  return (
    <>
      <h3 className="editComponentTitle">Add a New Dish</h3>
      <form className="editProfileName_form_container" onSubmit={handleSubmit}>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="Dish Name"
            name="name"
            id="name"
            className="inputEl"
            required
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
        </div>
        <div className="onboard_inputBox profileOverview editProfile">
          <textarea
            id="description-overview"
            name="descriptionOverview"
            placeholder="Tell us what makes this dish so special."
            rows="3"
            className="inputEl profileOverview editProfile"
            required
            value={dishDesc}
            onChange={(e) => setDishDesc(e.target.value)}
          ></textarea>
        </div>
        <div className="uploadDish_wrapper">
          <div className="onboard_inputBox addADish">
            <input
              type="file"
              id="images"
              name="images"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleImagesChange}
            />
            <ol className="dishesImgList">
              {dishImages?.map((dishImage, index) => (
                <li key={index}>
                  {dishImage.name} ({(dishImage.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ol>
          </div>
          {!dishImages[0] && (
            <label className="inputLabel addADish" htmlFor="images">
              Upload 1 - 3 images of the Dish
            </label>
          )}
        </div>
        <button
          disabled={isCreating}
          type="submit"
          className="button editProfileBtn"
        >
          {!isCreating ? <span>Add</span> : <CircularProgress size={20} />}
        </button>
      </form>
    </>
  );
};


export const AddEmploymentComp = ({
  userInfo,
  updateUser,
  handleClose,
  setIsCreating,
  isCreating
}) => {
  const [positionHeld, setPositionHeld] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobDuration, setJobDuration] = useState({
    from: "",
    to: "",
  });

  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createEmpResponse = await createNewEmploymentFunc();

    setIsCreating(false);
    if (createEmpResponse?.status == 500) {
      setEnqueueSnack({ message: createEmpResponse?.errorMessage, type: "error" });
      return;
    } else {
      setEnqueueSnack({ message: `New Experience added successfully`, type: "success" });
    }

    updateUser(createEmpResponse?.updatedUser)
    handleClose();
  };

  const createNewEmploymentFunc = async () => {
    setIsCreating(true);

    try {
      const response = await createEmployment({
        positionHeld: positionHeld,
        companyName: companyName,
        startDate: jobDuration?.from,
        endDate: jobDuration?.to,
        jobDesc: jobDesc,
        chef: userInfo?._id
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  return (
    <>
      <h3 className="editComponentTitle">Add an Employment History</h3>
      <form className="editProfileName_form_container" onSubmit={handleSubmit}>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="Your Position Held"
            name="name"
            id="name"
            className="inputEl"
            required
            value={positionHeld}
            onChange={(e) => setPositionHeld(e.target.value)}
          />
        </div>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="Company Name"
            name="name"
            id="name"
            className="inputEl"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="durationContainer">
          <div className="onboard_inputBox jobDuration">
            <span>From</span>
            <input
              type="text"
              placeholder="Start date"
              name="name"
              id="name"
              className="inputEl"
              required
              value={jobDuration?.from}
              onChange={(e) =>
                setJobDuration({ ...jobDuration, from: e.target.value })
              }
            />
          </div>
          -
          <div className="onboard_inputBox jobDuration">
            <span>To</span>
            <input
              type="text"
              placeholder="End date"
              name="name"
              id="name"
              className="inputEl"
              required
              value={jobDuration?.to}
              onChange={(e) =>
                setJobDuration({ ...jobDuration, to: e.target.value })
              }
            />
          </div>
        </div>
        <div className="onboard_inputBox profileOverview editProfile">
          <textarea
            id="description-overview"
            name="descriptionOverview"
            placeholder="Tell us about your experience working here as a chef."
            rows="3"
            className="inputEl profileOverview editProfile"
            required
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>
        </div>
        <button
          disabled={isCreating}
          type="submit"
          className="button editProfileBtn"
        >
          {!isCreating ? <span>Add</span> : <CircularProgress size={20} />}
        </button>
      </form>
    </>
  );
};


export const AddCertficateComp = ({
  userInfo,
  updateUser,
  handleClose,
  setIsCreating,
  isCreating
}) => {
  const [certTitle, setCertTitle] = useState("");
  const [dateAwarded, setDateAwarded] = useState("");
  const [certDescription, setCertdescription] = useState("");
  const [certImages, setCertImages] = useState([]);

  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleImagesChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setCertImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certImages[0]) return;

    const createCertResponse = await createNewCertFunc();

    setIsCreating(false);
    if (createCertResponse?.status == 500) {
      setEnqueueSnack({ message: createCertResponse?.errorMessage, type: "error" });
      return;
    } else {
      setEnqueueSnack({ message: `New Certificate added successfully`, type: "success" });
    }


    updateUser(createCertResponse?.updatedUser)
    handleClose();
  };

  const createNewCertFunc = async () => {
    setIsCreating(true);

    try {
      setEnqueueSnack({
        message: "Uploading your certificate images...",
        type: "info",
      });

      const imagesURL = await Promise.all(
        certImages?.map((certImage) =>
          uploadImage(certImage, "certificates", setEnqueueSnack)
        )
      );

      if (imagesURL[0]) {
        setEnqueueSnack({
          message: "Certificate image upload successful.",
          type: "success",
        });
      } else {
        return {
          status: 500,
          errorMessage: "Certificate image upload failed - try again.",
        };
      }

      const response = await createCertification({
        title: certTitle,
        dateAwarded: dateAwarded,
        description: certDescription,
        images: imagesURL,
        chef: userInfo?._id
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  return (
    <>
      <h3 className="editComponentTitle">Add a Certification</h3>
      <form className="editProfileName_form_container" onSubmit={handleSubmit}>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="The Certfication Title"
            name="name"
            id="name"
            className="inputEl"
            required
            value={certTitle}
            onChange={(e) => setCertTitle(e.target.value)}
          />
        </div>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="Date Awarded"
            name="name"
            id="name"
            className="inputEl"
            required
            value={dateAwarded}
            onChange={(e) => setDateAwarded(e.target.value)}
          />
        </div>
        <div className="onboard_inputBox profileOverview editProfile">
          <textarea
            id="description-overview"
            name="descriptionOverview"
            placeholder="Tell us about your certificate and how it transformed you."
            rows="3"
            className="inputEl profileOverview editProfile"
            required
            value={certDescription}
            onChange={(e) => setCertdescription(e.target.value)}
          ></textarea>
        </div>
        <div className="uploadDish_wrapper">
          <div className="onboard_inputBox addADish">
            <input
              type="file"
              id="images"
              name="images"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleImagesChange}
            />
            <ol className="dishesImgList">
              {certImages?.map((certImage, index) => (
                <li key={index}>
                  {certImage.name} ({(certImage.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ol>
          </div>
          {!certImages[0] && (
            <label className="inputLabel addADish" htmlFor="licenses">
            Upload atleast one image of your certificate
          </label>
          )}
        </div>
        <button
          disabled={isCreating}
          type="submit"
          className="button editProfileBtn"
        >
          {!isCreating ? <span>Add</span> : <CircularProgress size={20} />}
        </button>
      </form>
    </>
  );
};

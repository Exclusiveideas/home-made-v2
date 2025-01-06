"use state";

import "./editProfile.css";
import Backdrop from "@mui/material/Backdrop";
import useProfilePageStore from "@/store/profilePageStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import useAuthStore from "@/store/authStore";
import { updateUserProfile } from "@/api";
import { refreshUser, uploadPic } from "@/utils/functions";
import { CircularProgress } from "@mui/material";

const EditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const editTitle = useProfilePageStore((state) => state.editTitle);
  const setEditTitle = useProfilePageStore((state) => state.setEditTitle);
 
  const handleClose = () => {
    if(isUpdating) {
      return
    }
    setEditTitle("");
  };


  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={editTitle}
    >
      <div className="editCompWrapper">
        <CloseOutlinedIcon
          sx={{ fontSize: 30 }}
          onClick={handleClose}
          className="closeIcon"
        />
        <h3 className="editComponentTitle">Change Your {editTitle}</h3>
        {editTitle == "Profile Picture" ? (
          <EditProfilePic
            handleClose={handleClose}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
          />
        ) : (
          <EditNameComp
            handleClose={handleClose}
            editTitle={editTitle}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
          />
        )}
      </div>
    </Backdrop>
  );
};

export default EditProfile;

const EditNameComp = ({ handleClose, editTitle, isUpdating, setIsUpdating }) => {
  const [profileEdit, setProfileEdit] = useState("");

  const userInfo = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileEdit) return;

    const updatedProfile = await changeProfileValue();

    setIsUpdating(false);
    if (updatedProfile?.status == 500) {
      setEnqueueSnack({ message: updatedProfile?.errorMessage, type: "error" });
      return;
    } else {
      setEnqueueSnack({
        message: `${
          editTitle != "profileOverview" ? editTitle : "Profile Overview"
        } changed successfully`,
        type: "success",
      });
    }
    refreshUser(userInfo?._id, updateUser, setEnqueueSnack);

    handleClose();
  };

  const changeProfileValue = async () => {
    setIsUpdating(true);

    try {
      const response = await updateUserProfile({
        ...userInfo,
        [editTitle]: profileEdit,
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  useEffect(() => {
    if (!editTitle) {
      setProfileEdit("");
    }
  }, [editTitle]);

  useEffect(() => {
    if (editTitle == "profileOverview") {
      setProfileEdit(userInfo?.profileOverview);
    }
    if (editTitle == "languages") {
      setProfileEdit(userInfo?.languages + ", ");
    }
  }, [editTitle]);

  return (
    <>
      <form className="editProfileName_form_container" onSubmit={handleSubmit}>
        {editTitle != "profileOverview" ? (
          <div className="onboard_inputBox">
            <input
              type={editTitle != "rates" ? "text" : "number"}
              placeholder={
                editTitle != "rates"
                  ? `Your new ${editTitle}`
                  : "Set your hourly rate e.g $25 / hr"
              }
              name="name"
              id="name"
              className="inputEl"
              required
              value={profileEdit}
              onChange={(e) => setProfileEdit(e.target.value)}
            />
          </div>
        ) : (
          <div className="onboard_inputBox profileOverview editProfile">
            <textarea
              id="profile-overview"
              name="profileOverview"
              placeholder="Tell us about your culinary experience, specialties, and what makes you stand out as a chef."
              rows="3"
              className="inputEl profileOverview editProfile"
              required
              value={profileEdit}
              onChange={(e) => setProfileEdit(e.target.value)}
            ></textarea>
          </div>
        )}
        <button
          disabled={isUpdating}
          type="submit"
          className="button editProfileBtn"
        >
          {!isUpdating ? <span>Change</span> : <CircularProgress size={20} />}
        </button>
      </form>
    </>
  );
};

const EditProfilePic = ({ handleClose }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const userInfo = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(event.target.files[0]);
    setFileUrl(imageUrl);
  }, [file]);

  const changeProfilePic = async () => {
    if (!file) return;

    // handle update profile picture here
    const updatePicResult = await updateProfilePic(file);

    if (updatePicResult?.status == 500) {
      setEnqueueSnack({ message: updatePicResult?.errorMessage, type: "error" });
    } else {
      setEnqueueSnack({ message: "Picture changed successfully", type: "success" });
    }
    updateUser(updatePicResult?.updatedUser);
    setIsUpdating(false);
    handleClose();
  };

  const updateProfilePic = async (file) => {
    setIsUpdating(true);
    try {
      const uploadResponse = await uploadPic(file, null, setEnqueueSnack);
      if (uploadResponse?.status == 500) {
        return {
          status: 500,
          errorMessage: "Error uploading profile picture. Try again later.",
        };
      }

      const newprofilePicURL = uploadResponse.profilePic;

      const response = await updateUserProfile({
        ...userInfo,
        profilePic: newprofilePicURL,
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  return (
    <div className="profilePicture_uploadBox">
      <input
        type="file"
        id="file"
        accept="image/*"
        className="file-input"
        onChange={handleFileChange}
      />
      <label htmlFor="file" className="addImgCirc">
        {!file ? (
          <PersonAddAlt1Icon
            sx={{
              color: "white",
              cursor: "pointer",
              fontSize: "250%",
            }}
          />
        ) : (
          <img src={fileUrl} alt="Selected image" className="imagePreview" />
        )}
      </label>
      {!file && (
        <p className="selectFile">Please upload your passport to continue</p>
      )}
      <button
        disabled={isUpdating}
        onClick={changeProfilePic}
        className="button editProfileBtn"
      >
        {!isUpdating ? <span>Change</span> : <CircularProgress size={20} />}
      </button>
    </div>
  );
};

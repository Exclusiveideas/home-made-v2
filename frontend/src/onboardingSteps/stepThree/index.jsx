"use client";

import { useEffect, useState } from "react";
import "./stepThree.css";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const OnboardingStepThree = ({ isSettingUpAccount, chefInfo, setChefInfo, chefPicture, setChefPicture, formErr, setFormErr, onboardStep }) => {
  const [fileUrl, setFileUrl] = useState("");

  const clearErr = () => {
    setFormErr("");
  };
 
  const handleFileChange = (event) => {
    clearErr()
    setChefPicture(event.target.files[0])
  };

  
  const handleInputChange = ( key, value) => {
    setChefInfo({...chefInfo, [key]: value })
  }

  useEffect(() => {
    if(!chefPicture) return;

    const imageUrl = URL.createObjectURL(chefPicture);
    setFileUrl(imageUrl);
  }, [chefPicture]);

  return (
    <div className={`step_wrapper step_three ${onboardStep == 3 && "visible"}`}>
      <h1 className="pageTitle step_three">Profile Overview</h1>
      <form
        className="onboard_form_container step_three"
      >
        <div className="profilePicture_uploadBox">
          <input
            type="file"
            id="file"
            accept="image/*"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file" className="addImgCirc">
            {!chefPicture ? (
              <PersonAddAlt1Icon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  fontSize: "250%",
                }}
              />
            ) : (
              <img
                src={fileUrl}
                alt="Selected image"
                className="imagePreview"
              />
            )}
          </label>
          {!chefPicture && (
            <p className="selectFile">
              Please upload your correct passport to continue
            </p>
          )}
        </div>
        <div className="bottomContainer">
          <div className="half_form_container step_three left">
            <p className="onboardThree_inputLabel">
              Tell Us About Yourself
            </p>
            <div className="onboard_inputBox profileOverview">
              <textarea
                id="profile-overview"
                name="profileOverview"
                placeholder="Tell us about your culinary experience, specialties, and what makes you stand out as a chef."
                rows="3"
                className="inputEl profileOverview"
                required
                onFocus={clearErr}
                value={chefInfo?.profileOverview}
                onChange={(e) => handleInputChange('profileOverview', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <p className={`formError ${formErr && 'visible'}`}>{formErr}</p>
      </form>
    </div>
  );
};

export default OnboardingStepThree;

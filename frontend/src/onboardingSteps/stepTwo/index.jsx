"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import "./stepTwo.css";
import { validateClientOnboardForm } from '@/utils/onboardingFunctions';
import useProfilePageStore from "@/store/profilePageStore";

const OnboardingStepTwo = forwardRef(
  (
    {
      clientInfo,
      setClientInfo,
      chefInfo,
      setChefInfo,
      formErr,
      setFormErr,
      onboardStep,
      userRole,
      setUpProfile
    },
    ref
  ) => {
    const submitBtnRef = useRef();
    const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

    const clearErr = () => {
      setFormErr("");
    };

    const handleInputChange = (key, value) => {
      if(userRole == 'client') {
        setClientInfo({ ...clientInfo, [key]: value });
      } else {
        setChefInfo({ ...chefInfo, [key]: value });
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        // if supported
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            handleInputChange("position", { latitude, longitude });
            setEnqueueSnack({ message: `Position extracted successfully.`, type: "success" });
          },
          (error) => {
            // if we can't get the users position
            setEnqueueSnack({ message: `Error getting user location. try again`, type: "error" });
          }
        );
      } else {
        // if not supported
        setEnqueueSnack({ message: "Geolocation is not supported by this browser.", type: "error" });
      }
    };

    const triggerSubmit = () => {
      submitBtnRef?.current?.click();
    };

    useImperativeHandle(ref, () => ({
      triggerSubmit,
    }));

    return (
      <div className={`step_wrapper_two ${onboardStep == 2 && "visible"}`}>
        <h1 className="pageTitle_two">Basic Info</h1>
        {userRole == "client" ? (
          <ClientFormComponents 
          clientInfo={clientInfo}
          handleInputChange={handleInputChange}
          clearErr={clearErr}
          formErr={formErr}
          setFormErr={setFormErr}
          getUserLocation={getUserLocation}
          setUpProfile={setUpProfile}
           />
        ) : (
          <ChefFormComponents
            chefInfo={chefInfo}
            handleInputChange={handleInputChange}
            clearErr={clearErr}
            formErr={formErr}
            submitBtnRef={submitBtnRef}
            getUserLocation={getUserLocation}
          />
        )}
      </div>
    );
  }
);

OnboardingStepTwo.displayName = "OnboardingStepTwo";

export default OnboardingStepTwo;

const ChefFormComponents = ({
  chefInfo,
  handleInputChange,
  clearErr,
  formErr,
  submitBtnRef,
  getUserLocation,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="onboard_form_container" onSubmit={handleSubmit}>
      <div className="onboard_formContainer_halvesWrapper">
        <div className="half_form_container left">
          <div className="onboard_inputBox">
            <input
              type="text"
              placeholder="Your name"
              name="name"
              id="name"
              className="inputEl"
              required
              value={chefInfo?.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onFocus={clearErr}
            />
          </div>
          <div className="onboard_inputBox">
            <input
              type="text"
              placeholder="Your title e.g Creative Chef | Expert in Custom Recipes & Menus"
              name="title"
              id="title"
              required
              className="inputEl"
              value={chefInfo?.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onFocus={clearErr}
            />
          </div>
          <div className="onboard_inputBox">
            <input
              type="text"
              placeholder="Your city, country e.g Lagos, Nigeria"
              name="country"
              id="country"
              className="inputEl"
              required
              value={chefInfo?.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              onFocus={clearErr}
            />
          </div>
        </div>
        <div className="half_form_container">
          <div className="onboard_inputBox">
            <p className="positionTxt">
              <span>Latitude: {chefInfo?.position.latitude}</span>
              <span>Longitude: {chefInfo?.position.longitude}</span>
            </p>
            <div className="getLocation_btn" onClick={getUserLocation}>
              Get Position
            </div>
          </div>
          <div className="onboard_inputBox">
            <input
              type="number"
              placeholder="Hourly rate e.g $25 / hr"
              name="rate"
              id="rate"
              required
              className="inputEl rates"
              value={chefInfo?.rates}
              onChange={(e) => handleInputChange("rates", e.target.value)}
              onFocus={clearErr}
            />
            <p className="hourlyRate"> / hr</p>
          </div>
          <div className="onboard_inputBox">
            <input
              type="text"
              placeholder="Languages e.g english, spanish, french. csv format"
              name="languages"
              id="languages"
              className="inputEl"
              value={chefInfo?.languages}
              onChange={(e) => handleInputChange("languages", e.target.value)}
              onFocus={clearErr}
              required
            />
          </div>
        </div>
      </div>
      <p className={`formError ${formErr && "visible"}`}>{formErr}</p>
      <button
        ref={submitBtnRef}
        type="submit"
        className="button authBtn invisible"
      >
        <span>Submit</span>
      </button>
    </form>
  ); 
};




const ClientFormComponents = ({
  clientInfo,
  handleInputChange,
  clearErr,
  formErr,
  setFormErr,
  getUserLocation,
  setUpProfile
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate form
    const validated = validateClientOnboardForm(clientInfo, setFormErr)
    if(!validated) return
    
    setUpProfile()
  };

  return (
    <form className="onboard_form_container client" onSubmit={handleSubmit}>
      <div className="onboard_inputBox">
        <input
          type="text"
          placeholder="Your name"
          name="name"
          id="name"
          className="inputEl"
          required
          value={clientInfo?.clientName}
          onChange={(e) => handleInputChange("clientName", e.target.value)}
          onFocus={clearErr}
        />
      </div>
      <div className="onboard_inputBox">
        <input
          type="text"
          placeholder="Your city, country e.g Lagos, Nigeria"
          name="country"
          id="country"
          className="inputEl"
          required
          value={clientInfo?.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          onFocus={clearErr}
        />
      </div>
      <div className="onboard_inputBox getLocation">
        <p className="positionTxt">
          <span>Latitude: {clientInfo?.position.latitude}</span>
          <span>Longitude: {clientInfo?.position.longitude}</span>
        </p>
        <div className="getLocation_btn" onClick={getUserLocation}>
          Get Position
        </div>
      </div>
      <button type="submit" className="button authBtn">
        <span>Submit</span>
      </button>
      <p className={`formError ${formErr && "visible"}`}>{formErr}</p>
    </form>
  );
};

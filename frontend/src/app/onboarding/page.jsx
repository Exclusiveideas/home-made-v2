"use client";

import { useEffect, useRef, useState } from "react";
import "./onboarding.css";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import OnboardingStepOne from '@/onboardingSteps/stepOne';
import OnboardingStepTwo from '@/onboardingSteps/stepTwo';
import OnboardingStepThree from '@/onboardingSteps/stepThree';
import { validateStepTwo, validateStepThree } from '@/utils/onboardingFunctions';
import { useRouter } from 'next/navigation';
import SnackbarComponent from '@/app/components/snackbarComponent';
import useAuthStore from "@/store/authStore";
import { updateUserProfile } from "@/api";
import { uploadPic } from "@/utils/functions";
import useProfilePageStore from "@/store/profilePageStore";


const Onboarding = () => {
  const [userRole, setUserRole] = useState(null);
  const [onboardStep, setOnboardStep] = useState(1);
  const [formErr, setFormErr] = useState("");
  const [isSettingUpAccount, setIsSettingUpAccount] = useState(false)

  const userInfo = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const enqueueSnack = useProfilePageStore((state) => state.enqueueSnack);
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);
  
  const router = useRouter();

  const enqueueFuncRef = useRef();

  const validateOnboardStepTwo = useRef();

  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    location: '',
    position: { latitude: '', longitude: ''},
    role: 'client'
  })

  const [chefPicture, setChefPicture] = useState(null)
  const [chefInfo, setChefInfo] = useState({
    name: '',
    title: '',
    location: '',
    position: { latitude: '', longitude: ''},
    rates: '',
    languages: '',
    profilePic: null,
    profileOverview: '',
    role: 'chef'
  });
 

  useEffect(() => {
    setFormErr('')
  }, [userRole])

  useEffect(() => {
    if (userInfo?.role) router.push("/profile");
    else if (!userInfo?._id) {
      router.push("/auth");
    }
  }, [userInfo])


  const selectRole = (role) => {
    setUserRole(role);
  };

  
  async function setUpProfile() {
    callEnqueueSnackbar('Setting up your account', 'info')
    setIsSettingUpAccount(true)

    // function to setup account

    let setupUserResult;

    if(userRole == 'client') {
      // setup client account
      setupUserResult = await setupClient()
    } else {
      // setup chef account
      setupUserResult = await setupChef()
    }

    if(setupUserResult?.status == 500) {
      callEnqueueSnackbar(setupUserResult?.errorMessage, 'error')
      return
    } else {
      callEnqueueSnackbar('Account setup complete', 'success')
      updateUser(setupUserResult?.updatedUser)

      setTimeout(() => {      
        router.push(`/profile`)
      }, 2000);
    }
    

  }

  const setupClient = async () => {
    const response = await updateUserProfile({
      ...userInfo,
      name: clientInfo?.clientName,
      location: clientInfo?.location,
      position: clientInfo?.position,
      role: 'client'
    })

    return response
  }

  const setupChef = async () => {
    let profilePicURL;

    try {
      // used stored profile picture url if available
      if (!chefInfo?.profilePic) {
        const uploadResponse = await uploadPic(chefPicture, setChefInfo, setEnqueueSnack);
        if (uploadResponse?.status === 500) {
          return {
            status: 500,
            errorMessage: "Error uploading profile picture. Try again later.",
          };
        }
 
        profilePicURL = uploadResponse.profilePic
      } else {
        profilePicURL = chefInfo?.profilePic
      }
      
      
      const response = await updateUserProfile({
        ...userInfo,
        ...chefInfo,
        profilePic: profilePicURL,
      });

      return response;

    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  const prevStep = () => {
      setOnboardStep(prev => prev < 2 ? 1 : prev - 1)
  }

  function nextStep() {
    if(!userRole) return

    if(onboardStep == 1) {
      setOnboardStep(prev => prev == 3 ? 3 : prev + 1)
      return
    }

    if(onboardStep == 2) {
      validateStepTwo(chefInfo, validateOnboardStepTwo, setFormErr, setOnboardStep);
    } else if(onboardStep == 3) {
      validateStepThree(chefInfo, chefPicture, setFormErr, setUpProfile);
    }
  }

  const callEnqueueSnackbar = (message, variant) => {
    if (enqueueFuncRef.current) {
      enqueueFuncRef.current.enqueueSnack(message, variant);
    }
  };
  
  useEffect(() => {
    if(enqueueSnack?.message) {
      callEnqueueSnackbar(enqueueSnack?.message, enqueueSnack?.type)
    }
  }, [enqueueSnack])

  return (
    <div className="onboardingPage_wrapper">
      <div className="direction_container">
        <div onClick={prevStep} className={`icon_wrapper ${onboardStep < 2  && 'invinsible'}`}>
          <ArrowCircleLeftIcon />
        </div>
      </div>
      <div className="onboardingInfo_container">
        <OnboardingStepOne userRole={userRole} selectRole={selectRole} onboardStep={onboardStep} />   
        <OnboardingStepTwo setUpProfile={setUpProfile} clientInfo={clientInfo} setClientInfo={setClientInfo} userRole={userRole} ref={validateOnboardStepTwo} chefInfo={chefInfo} setChefInfo={setChefInfo} formErr={formErr} setFormErr={setFormErr} onboardStep={onboardStep} />   
        <OnboardingStepThree isSettingUpAccount={isSettingUpAccount} onboardStep={onboardStep} chefInfo={chefInfo} setChefInfo={setChefInfo} chefPicture={chefPicture} setChefPicture={setChefPicture} formErr={formErr} setFormErr={setFormErr}  /> 
      </div>
      <div className="direction_container forward">
        <div onClick={nextStep} className={`icon_wrapper ${onboardStep > 1 && userRole == 'client'  && 'invinsible'}`}>
          <ArrowCircleRightIcon />
        </div>
      </div>
      <SnackbarComponent ref={enqueueFuncRef} />
    </div>
  );
};

export default Onboarding;

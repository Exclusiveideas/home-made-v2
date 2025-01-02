"use client";

import Image from "next/image";
import "./browseChefProfile.css";
import useAuthStore from "@/store/authStore";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Navbar from "@/app/components/navbar";
import EnlargeImageComp from '@/app/components/enlargeImageComp';
import useProfilePageStore from "@/store/profilePageStore";
import ExpandedDishDetails from '@/explorePageComponents/expandedDishDetails';
import { useEffect, useRef, useState } from "react";
import SnackbarComponent from "@/app/components/snackbarComponent";
import { useRouter, usePathname } from 'next/navigation';
import { getUserProfile, createChatRoom } from "@/api";
import { calculateDistanceApart } from '@/utils/functions';
import useChatStore from "@/store/userChatStore";
import ProfilePageSkeleton from "@/profilePageComponents/ProfilePageSkeleton";
import MenuNav from '../../components/menuNav';



const BrowseChefProfile = () => {
  const [chefDetails, setChefDetails] = useState({})
  const [distanceApart, setDistanceApart] = useState('')


  const userInfo = useAuthStore((state) => state.user);
  const setEnlargeImage = useProfilePageStore(
    (state) => state.setEnlargeImage
  );
  const setExpandedDishDetails = useProfilePageStore((state) => state.setExpandedDishDetails);
  const setActiveChatRoomID = useChatStore((state) => state.setActiveChatRoomID);
  const enqueueSnack = useProfilePageStore((state) => state.enqueueSnack);
  
    const enqueueFuncRef = useRef();

    const router = useRouter();
    const pathname = usePathname(); // Get the current pathname
    const userID = pathname.split('/')[2];

  const expandDishDetails = (dish) => {
    setExpandedDishDetails(dish)
  }
  
  const handleChatBtnClick = () => {
    if(!userInfo?._id) {
      callEnqueueSnackbar('Create an account to chat', 'info')
    } else {
      goToChatRoom();
    }
  }

  const goToChatRoom = async () => {
    const chatRoomDetails = await createChatRoom({
          memberA: userInfo?._id,
          memberB: chefDetails?._id
    })

    if(chatRoomDetails?.status == 200) {
      setActiveChatRoomID(chatRoomDetails?.newChatRoom?._id)
      router.push('/chats')
    } else {
      callEnqueueSnackbar(chatRoomDetails?.errorMessage, "error");
    }

  }

  
  const callEnqueueSnackbar = (message, variant) => {
    if (enqueueFuncRef.current) {
      enqueueFuncRef.current.enqueueSnack(message, variant);
    }
  };

  useEffect(() => {
    // fetch chef profile details
    if(!userID) {
      router.push('/browse')
    }
    fetchChef() 
  }, [])
  
  const fetchChef = async () => {
    const chefProfileDetails = await getUserProfile(userID);

    if (chefProfileDetails?.status == 200) {
      setChefDetails(chefProfileDetails?.userProfile);
      setDistanceApart(calculateDistanceApart(userInfo?.position, chefProfileDetails?.position))
    } else {
      callEnqueueSnackbar(chefProfileDetails?.errorMessage, "error");
      setTimeout(() => {
        router.push('/browse');
      }, 3000);
    }
  };

  useEffect(() => {
    if(enqueueSnack?.message) {
      callEnqueueSnackbar(enqueueSnack?.message, enqueueSnack?.type)
    }
  }, [enqueueSnack])

  return (
    <div className="browseChefProfile">
      <Navbar />
      {chefDetails?.name ? (
        <div className="chefProfile_page">
          <div className="chefProfile_wrapper">
            <div className="topPicture_section">
              <div className="topPicture_section_innerCont">
                <div className="profilePic_container chef">
                  <Image
                    src={
                      chefDetails?.profilePic
                        ? chefDetails?.profilePic
                        : `/images/chef_drawing_one.png`
                    }
                    width={500}
                    height={500}
                    alt="chef drawing"
                    className={`profilePage_picture`}
                  />
                </div>
                <div className="topPicture_section_nameContainer">
                  <h2 className="nameTxt">{chefDetails?.name}</h2>
                  <p className="locationTxt">
                    <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
                    <span>
                      {chefDetails?.location}({distanceApart}km away)
                    </span>
                  </p>
                </div>
              </div>
              <div className="topPicture_section_rightSection">
                <button
                  className="button chatBtn profilePage"
                  onClick={handleChatBtnClick}
                >
                  <span>Chat</span>
                </button>
              </div>
            </div>
            <div className="profileOverview_section">
              <div className="title_x_rates_container">
                <h3 className="profileTitle">{chefDetails?.title}</h3>
                <p className="profileRates">${chefDetails?.rates}.00/hr</p>
              </div>
              <div className="profileOverview_container">
                <p>{chefDetails?.profileOverview}</p>
              </div>
            </div>
            <div className="profile_languages_section">
              <div className="nameBox alignLeft fullWidth">
                <div className="languages_subContainer">
                  <h4 className="language_Title">Languages</h4>
                  <div className="languages_list">
                    {chefDetails?.languages?.split(",").map((language, i) => (
                      <p key={i} className="languageTxt">
                        {language}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="dishes_catalogue_section">
              <h3 className="catalogue_title">Dishes Catalogue</h3>
              <div className="catalogue_list">
                {chefDetails?.dishCatalogue?.map((catalogue, i) => (
                  <div
                    key={i}
                    className="catalogue_container"
                    onClick={() => expandDishDetails(catalogue)}
                  >
                    <div className="dishImage_container">
                      <Image
                        src={
                          catalogue.images[0]
                            ? catalogue.images[0]
                            : `/images/catalogue_one.jpg`
                        }
                        width={500}
                        height={500}
                        alt="chef drawing"
                        className={`catalogue_image`}
                      />
                    </div>
                    <p className="dishName">{catalogue.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="chefExperience_wrapper">
            <div className="chefExperience_wrapper_titleSect">
              <h3 className="experienceTitle">Employment history</h3>
            </div>
            <>
              {chefDetails?.experiences?.map((experience, i) => (
                <div key={i} className="experienceContainer">
                  <div className="experienceContainer_topSect">
                    <h4 className="experienceDetails_position">
                      {experience?.position} | {experience?.company}
                    </h4>
                    <p className="experienceDetails_duration">
                      {experience?.startDate} - {experience?.endDate}
                    </p>
                  </div>
                  <div className="experienceContainer_descriptionSect">
                    <p className="experienceDescription">
                      {experience?.jobDesc}
                    </p>
                  </div>
                </div>
              ))}
            </>
          </div>
          <div className="chefCertification_wrapper">
            <div className="chefExperience_wrapper_titleSect">
              <h3 className="experienceTitle">Certifications</h3>
            </div>
            <>
              {chefDetails?.certifications?.map((certification, i) => (
                <div key={i} className="experienceContainer">
                  <div className="experienceContainer_topSect">
                    <h4 className="experienceDetails_position">
                      {certification?.title}
                    </h4>
                    <p className="experienceDetails_duration">
                      {certification?.dateAwarded}
                    </p>
                  </div>
                  <div className="experienceContainer_descriptionSect">
                    <p className="experienceDescription">
                      {certification?.description}
                    </p>
                  </div>
                  <div className="certificate_imageContainer">
                    {certification?.images.map((image, i) => (
                      <Image
                        key={i}
                        src={image}
                        width={500}
                        height={500}
                        alt="certificate Image"
                        className={`certificateImage`}
                        onClick={() => setEnlargeImage(image)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          </div>
        </div>
      ) : (
        <ProfilePageSkeleton />
      )}
      <SnackbarComponent ref={enqueueFuncRef} />
      <ExpandedDishDetails />
      <EnlargeImageComp />
      <MenuNav />
    </div>
  ); 
};

export default BrowseChefProfile;

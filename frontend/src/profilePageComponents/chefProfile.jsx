"use client";

import Image from "next/image";
import "./profilePageComps.css";
import useAuthStore from "@/store/authStore";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddIcon from "@mui/icons-material/Add";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import useProfilePageStore from '@/store/profilePageStore';
import EditProfile from '@/profilePageComponents/editProfileComponents/editProfile';
import AddNewSect from '@/profilePageComponents/editProfileComponents/editProfile/addNewSect';
import EditEmploymentSect from '@/profilePageComponents/editProfileComponents/editProfile/EditEmploymentSect';
import ConfirmDelete from '@/profilePageComponents/editProfileComponents/deleteProfileSect/confirmDelete';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandedDishDetails from "@/explorePageComponents/expandedDishDetails";
import EnlargeImageComp from '@/app/components/enlargeImageComp';
import { useEffect, useState } from "react";
import { getOneCertification, getOneDish, getOneExperience } from "@/api";



const ChefProfile = () => {
  const [userLists, setUserLists] = useState({
    dishCatalogue: [],
    experiences: [],
    certifications: []
  })

  const userInfo = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logOut);
  const deletedDishID = useAuthStore((state) => state.deletedDishID);
  const deletedExperienceID = useAuthStore((state) => state.deletedExperienceID);
  const deletedCertificationID = useAuthStore((state) => state.deletedCertificationID);
  const setDeletedDishID = useAuthStore((state) => state.setDeletedDishID);
  const setDeletedExperienceID = useAuthStore((state) => state.setDeletedExperienceID);
  const setDeletedCertificationID = useAuthStore((state) => state.setDeletedCertificationID);
  const setEditTitle = useProfilePageStore((state) => state.setEditTitle);
  const setAddSection = useProfilePageStore((state) => state.setAddSection);
  const setEditEmploymentSect = useProfilePageStore((state) => state.setEditEmploymentSect);
  const setConfirmDelete = useProfilePageStore(
    (state) => state.setConfirmDelete
  );
  const setEnlargeImage = useProfilePageStore( 
    (state) => state.setEnlargeImage
  );
  const setExpandedDishDetails = useProfilePageStore((state) => state.setExpandedDishDetails);
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const expandDishDetails = (dish) => {
    setExpandedDishDetails(dish)
  } 

  const handleLogout = () => {
    logOut()
  }

  useEffect(() => {
    fetchUserLists()
  }, [userInfo])

  useEffect(() => {
    if(deletedDishID) {
      removeDeletedDish(deletedDishID)
    }
    if(deletedExperienceID) {
      removeDeletedExperience(deletedExperienceID)
    }
    if(deletedCertificationID) {
      removeDeletedCertification(deletedCertificationID)
    }
  }, [deletedDishID, deletedExperienceID, deletedCertificationID])
  

  const fetchUserLists = () => {
    userInfo?.dishCatalogue?.forEach(dishID => {
      fetchDish(dishID)
    });
    userInfo?.experiences?.forEach(experienceID => {
      fetchExperience(experienceID)
    });
    userInfo?.certifications?.forEach(certificationID => {
      fetchCertification(certificationID)
    });
  }

  const fetchDish = async (dishID) => {
    const dishDetails = await getOneDish(dishID);

    if (dishDetails?.status == 200) {
      setUserLists((prev) => ({
        ...prev,
        dishCatalogue: prev.dishCatalogue
          ? prev.dishCatalogue.some((dish) => dish?._id === dishDetails?.fetchedDish?._id)
            ? prev.dishCatalogue.map((dish) =>
                dish._id === dishDetails?.fetchedDish?._id ? dishDetails?.fetchedDish : dish
              ) // Update the dish if it exists
            : [...prev.dishCatalogue, dishDetails?.fetchedDish] // Add the new dish if it doesn't exist
          : [dishDetails?.fetchedDish], // If `dishCatalogue` doesn't exist, create it with the new dish
      }));
    } else {
      setEnqueueSnack({ message: dishDetails?.errorMessage, type: "error" });
    }
  };

  const fetchExperience = async(experienceID) => {
    const experienceDetails = await getOneExperience(experienceID);

    if (experienceDetails?.status == 200) {
      setUserLists((prev) => ({
        ...prev,
        experiences: prev.experiences
          ? prev.experiences.some((experience) => experience?._id === experienceDetails?.fetchedExperience?._id)
            ? prev.experiences.map((experience) =>
              experience._id === experienceDetails?.fetchedExperience?._id ? experienceDetails?.fetchedExperience : experience
              ) // Update the experience if it exists
            : [...prev.experiences, experienceDetails?.fetchedExperience] // Add the new experience if it doesn't exist
          : [experienceDetails?.fetchedExperience], // If `experiences` doesn't exist, create it with the new experience
      }));
    } else {
      setEnqueueSnack({ message: experienceDetails?.errorMessage, type: "error" });
    }
  }

  const fetchCertification = async(certificationID) => {
    const certificationDetails = await getOneCertification(certificationID);

    if (certificationDetails?.status == 200) {
      setUserLists((prev) => ({
        ...prev,
        certifications: prev.certifications
          ? prev.certifications.some((experience) => experience?._id === certificationDetails?.fetchedCertification?._id)
            ? prev.certifications.map((experience) =>
              experience._id === certificationDetails?.fetchedCertification?._id ? certificationDetails?.fetchedCertification : experience
              ) // Update the certification if it exists
            : [...prev.certifications, certificationDetails?.fetchedCertification] // Add the new certification if it doesn't exist
          : [certificationDetails?.fetchedCertification], // If `certifications` doesn't exist, create it with the new experience
      }));
    } else {
      setEnqueueSnack({ message: certificationDetails?.errorMessage, type: "error" });
    }
  }

  const removeDeletedDish = (deletedDishID) => {
    setUserLists((prev) => ({
      ...prev,
      dishCatalogue: prev.dishCatalogue
        ? prev.dishCatalogue.filter((dish) => dish._id !== deletedDishID)
        : [],
    }));
    setDeletedDishID(null)
  }

  const removeDeletedExperience = (deletedExperienceID) => {
    setUserLists((prev) => ({
      ...prev,
      experiences: prev.experiences
        ? prev.experiences.filter((experience) => experience._id !== deletedExperienceID)
        : [],
    }));
    setDeletedExperienceID(null)
  }

  const removeDeletedCertification = (deletedCertificationID) => {
    setUserLists((prev) => ({
      ...prev,
      certifications: prev.certifications
        ? prev.certifications.filter((certification) => certification._id !== deletedCertificationID)
        : [],
    }));
    setDeletedCertificationID(null)
  }
  

  return (
    <div className="chefProfile_page">
      <div className="chefProfile_wrapper">
        <div className="topPicture_section">
          <div className="topPicture_section_innerCont">
            <div
              className="profilePic_container chef"
              onClick={() => setEditTitle("Profile Picture")}
            >
              <Image
                src={
                  userInfo?.profilePic
                    ? userInfo?.profilePic
                    : `/images/chef_drawing_one.png`
                }
                width={500}
                height={500}
                alt="chef drawing"
                className={`profilePage_picture`}
              />
              <div className="changeProfilePic_container chef">
                <DriveFileRenameOutlineOutlinedIcon
                  className="editIcon"
                />
              </div>
            </div>
            <div className="topPicture_section_nameContainer">
              <div className="nameBox alignLeft">
                <h2 className="nameTxt">{userInfo?.name}</h2>
                <DriveFileRenameOutlineOutlinedIcon
                  onClick={() => setEditTitle("name")}
                  className="editIcon"
                />
              </div>
              <div className="nameBox alignLeft">
                <p className="locationTxt">
                  <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
                  <span>{userInfo?.location}</span>
                </p>
                <DriveFileRenameOutlineOutlinedIcon
                  onClick={() => setEditTitle("location")}
                  className="editIcon"
                />
              </div>
            </div>
          </div>
          <div className="topPicture_section_rightSection">
            <button className="button chatBtn logout" onClick={handleLogout}>
              <span>Log Out</span>
            </button>
          </div>
        </div>
        <div className="profileOverview_section">
          <div className="title_x_rates_container">
            <div className="nameBox alignLeft">
              <h3 className="profileTitle">{userInfo?.title}</h3>
              <DriveFileRenameOutlineOutlinedIcon
                onClick={() => setEditTitle("title")}
                className="editIcon"
              />
            </div>
            <div className="nameBox alignLeft">
              <p className="profileRates">${userInfo?.rates}.00/hr</p>
              <DriveFileRenameOutlineOutlinedIcon
                onClick={() => setEditTitle("rates")}
                className="editIcon"
              />
            </div>
          </div>
          <div className="profileOverview_container">
            <div className="nameBox alignLeft">
              <p>{userInfo?.profileOverview}</p>
              <DriveFileRenameOutlineOutlinedIcon
                onClick={() => setEditTitle("profileOverview")}
                className="editIcon top"
              />
            </div>
          </div>
        </div>
        <div className="profile_languages_section">
          <div className="nameBox alignLeft fullWidth">
            <div className="languages_subContainer">
              <h4 className="language_Title">Languages</h4>
              <div className="languages_list">
                {userInfo?.languages?.split(",").map((language, i) => (
                  <p key={i} className="languageTxt">
                    {language}
                  </p>
                ))}
              </div>
            </div>
            <DriveFileRenameOutlineOutlinedIcon
              onClick={() => setEditTitle("languages")}
              className="editIcon top"
            />
          </div>
        </div>
        <div className="dishes_catalogue_section">
          <h3 className="catalogue_title">Dishes Catalogue</h3>
          <div className="catalogue_list">
            {userLists?.dishCatalogue?.map((catalogue, i) => (
              <div
                key={i}
                className="catalogue_container"
                onClick={() => expandDishDetails(catalogue)}
              >
                <div className="dishImage_container">
                  <Image
                    src={
                      catalogue?.images[0]
                        ? catalogue?.images[0]
                        : `/images/catalogue_one.jpg`
                    }
                    width={500}
                    height={500}
                    alt="chef drawing"
                    className={`catalogue_image`}
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                  />
                </div>
                <p className="dishName">{catalogue.name}</p>
              </div>
            ))}
            <div className="addNewCatalogue_container">
              <div
                className="addNewCatalogue_innerContainer"
                onClick={() => setAddSection("dish")}
              >
                <AddIcon sx={{ fontSize: 50 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chefExperience_wrapper">
        <div className="chefExperience_wrapper_titleSect">
          <h3 className="experienceTitle">Employment history</h3>
          <ControlPointOutlinedIcon
            className="addExperience_icon"
            sx={{ fontSize: 35 }}
            onClick={() => setAddSection("employment")}
          />
        </div>
        {userLists?.experiences[0] ? (
          <>
            {userLists?.experiences?.map((experience, i) => (
              <div key={i} className="experienceContainer">
                <div className="experienceContainer_topSect">
                  <h4 className="experienceDetails_position">
                    {experience?.positionHeld} | {experience?.companyName}
                  </h4>
                  <p className="experienceDetails_duration">
                    {experience?.startDate} - {experience?.endDate}
                  </p>
                </div>
                <div className="experienceContainer_descriptionSect">
                  <p className="experienceDescription">{experience?.jobDesc}</p>
                </div>
                <div className="editEmploymentSection">
                  <DriveFileRenameOutlineOutlinedIcon
                    onClick={() =>
                      setEditEmploymentSect({
                        label: "employment",
                        toUpdate: experience,
                      })
                    }
                    className="editIcon"
                  />
                  <DeleteIcon
                    onClick={() =>
                      setConfirmDelete({
                        label: "employment",
                        toDelete: experience,
                      })
                    }
                    className="editIcon"
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <AddToThisSection section="experience" />
        )}
      </div>
      <div className="chefCertification_wrapper">
        <div className="chefExperience_wrapper_titleSect">
          <h3 className="experienceTitle">Certifications</h3>
          <ControlPointOutlinedIcon
            className="addExperience_icon"
            sx={{ fontSize: 35 }}
            onClick={() => setAddSection("certifications")}
          />
        </div>
        {userLists?.certifications[0] ? (
          <>
            {userLists?.certifications?.map((certification, i) => (
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
                <div className="editEmploymentSection">
                  <DeleteIcon
                    onClick={() =>
                      setConfirmDelete({
                        label: "certification",
                        toDelete: certification,
                      })
                    }
                    className="editIcon"
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <AddToThisSection section="certifications" />
        )}
      </div>
      <EditProfile />
      <AddNewSect />
      <EditEmploymentSect />
      <ConfirmDelete />
      <ExpandedDishDetails />
      <EnlargeImageComp />
    </div>
  );
};

export default ChefProfile;



const AddToThisSection = ({ section }) => {
  return (
    <div className="addToSection_container">
      <Image
        src={section == 'experience' ? '/images/case.png' : '/images/champion.png'}
        width={300}
        height={300}
        alt="add to section image"
        className={`addToSectionImg`}
      />
      <p>
        Listing your {section} can help prove your specific knowledge or
        abilities.
      </p>
    </div>
  );
}
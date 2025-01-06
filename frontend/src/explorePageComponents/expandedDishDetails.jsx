"use state";

import "./explorePageComps.css";
import Backdrop from "@mui/material/Backdrop";
import useProfilePageStore from "@/store/profilePageStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import useAuthStore from "@/store/authStore";
import { createChatRoom, getUserProfile } from "@/api";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import EditDishComp from '@/profilePageComponents/editProfileComponents/editProfile/editDish';
import ConfirmDelete from '@/profilePageComponents/editProfileComponents/deleteProfileSect/confirmDelete';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

const ExpandedDishDetails = () => {
  const [dishChefDetails, setDishChefDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const userInfo = useAuthStore((state) => state.user);

  const expandedDishDetails = useProfilePageStore(
    (state) => state.expandedDishDetails
  );
  const setEditDish = useProfilePageStore(
    (state) => state.setEditDish
  );
  const setExpandedDishDetails = useProfilePageStore(
    (state) => state.setExpandedDishDetails
  );
  const setConfirmDelete = useProfilePageStore(
    (state) => state.setConfirmDelete
  );
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleClose = () => {
    setExpandedDishDetails(null);
  }; 

  const goToChefProfile = () => {
    router.push(`/browse/${expandedDishDetails?.chef}`);
    handleClose()
  }

  const handleChatBtnClick = () => {
    if(!userInfo?._id) {
      setEnqueueSnack({ message: 'Create an account to chat', type: "info" });
    } else {
      setLoading(true)
      goToChatRoom();
    }
  }

  const goToChatRoom = async () => {
    const chatRoomDetails = await createChatRoom({
      memberA: userInfo?._id,
      memberB: expandedDishDetails?.chefDetails?._id,
    });

    if (chatRoomDetails?.status == 200) {
      setActiveChatRoomID(chatRoomDetails?.newChatRoom?._id);
      router.push("/chats");
    } else {
      setEnqueueSnack({
        message: chatRoomDetails?.errorMessage,
        type: "error",
      });
    }
    setLoading(false)
  };


  const editThisDish = () => {
    setEditDish(expandedDishDetails);
  };

  useEffect(() => {
    if (expandedDishDetails?.chef) {
      fetchChef(expandedDishDetails?.chef);
    } else {
      setDishChefDetails(null)
    }
  }, [expandedDishDetails]);


  const fetchChef = async (chefID) => {
    const chefProfileDetails = await getUserProfile(chefID);

    if (chefProfileDetails?.status == 200) {
      const chefDets = chefProfileDetails?.userProfile
      setDishChefDetails({
        name: chefDets?.name,
        title: chefDets?.title,
        image: chefDets?.profilePic
      });
    } else {
      setEnqueueSnack({ message: chefProfileDetails?.errorMessage, type: "error" });
    }
  };
  

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={expandedDishDetails?.name}
    >
      {expandedDishDetails && (
        <div className="expandedDishDetails_wrapper">
          <div className="actionBtns">
            <DeleteIcon
              onClick={() => 
                setConfirmDelete({
                  label: "dish",
                  toDelete: expandedDishDetails,
                })
              }
              className={`deleteDishIcon ${
                userInfo?._id == expandedDishDetails?.chef && "visible"
              }`}
            />
            <DriveFileRenameOutlineOutlinedIcon
              onClick={editThisDish}
              className={`editDishIcon ${
                userInfo?._id == expandedDishDetails?.chef && "visible"
              }`}
            />
            <CloseOutlinedIcon
              sx={{ fontSize: 30 }}
              onClick={handleClose}
              className="closeDishIcon"
            />
          </div>
          <div className="titleContainer">
            <h4>{expandedDishDetails?.name}</h4>
          </div>
          <div className="expandedDishesImages">
            {expandedDishDetails?.images?.map((img, i) => (
              <Image
                key={i}
                src={img}
                width={500}
                height={500}
                alt="certificate Image"
                className={`expandedImages_enlarged`}
              />
            ))}
          </div>
          <div className="descriptionContainer">
            <h4>About {expandedDishDetails?.name}</h4>
          </div>
          <div className="expandedDishes_description">
            <p>{expandedDishDetails?.description}</p>
          </div>
          {dishChefDetails && (
            <div className="dish_chefSection">
              <div className="leftSection" onClick={goToChefProfile}>
                <div className="chefPic_container">
                  <Image
                    src={
                      dishChefDetails?.image
                        ? dishChefDetails?.image
                        : `/images/chef_drawing_one.png`
                    }
                    width={300}
                    height={300}
                    alt="chef's picture"
                    className={`dish_chefImg`}
                  />
                </div>
                <div className="chefInfo_container">
                  <h3 className="chefName">{dishChefDetails?.name}</h3>
                  <p className="chefTitle">{dishChefDetails?.title}</p>
                </div>
              </div>
              <div className="rightSection">
                {expandedDishDetails?.chef !== userInfo?._id && (
                  <button
                    className="button chatBtn"
                    onClick={handleChatBtnClick}
                  >
                    {!loading ? (
                      <span>Chat</span>
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </button> 
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <EditDishComp userInfo={userInfo} />
      <ConfirmDelete />
    </Backdrop>
  );
};

export default ExpandedDishDetails;

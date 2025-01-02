import Image from "next/image";
import "./profilePageComps.css";
import useAuthStore from "@/store/authStore";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import EditProfile from "@/profilePageComponents/editProfileComponents/editProfile";
import useProfilePageStore from "@/store/profilePageStore";

const ClientProfile = () => {
  const userInfo = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logOut);
  const setEditTitle = useProfilePageStore((state) => state.setEditTitle);

  const firstThreeRooms = userInfo?.chats?.slice(0, 4);
  
  const handleLogout = () => {
    logOut()
  }


  return (
    <div className="clientProfilePage">
      <div className="clientProfilePage_topSection">
        <div
          className="profilePic_container client"
          onClick={() => setEditTitle("Profile Picture")}
        >
          <Image
            src={
              userInfo?.profilePic
                ? userInfo?.profilePic
                : `/images/client_avatar.png`
            }
            width={500}
            height={500}
            alt="chef drawing"
            className={`profilePage_picture`}
          />
          <div className="changeProfilePic_container">
            <DriveFileRenameOutlineOutlinedIcon
              className="editIcon clientPic"
            />
          </div>
        </div>
        <div className="nameBox">
          <h3 className="userName">{userInfo?.name}</h3>
          <DriveFileRenameOutlineOutlinedIcon
            onClick={() => setEditTitle("name")}
            className="editIcon"
          />
        </div>
        <div className="nameBox marginBottom">
          <p className="userLocation">{userInfo?.location}</p>
          <DriveFileRenameOutlineOutlinedIcon
            onClick={() => setEditTitle("location")}
            className="editIcon"
          />
        </div>
        <div className="topPicture_section_rightSection">
            <button
              className="button chatBtn logout"
              onClick={handleLogout}
            >
              <span>Log Out</span>
            </button>
          </div>
      </div>
      <div className="clientProfilePage_otherSection">
        <h3 className="sectionHeaderTxt">
          <a href="/chats">Chats</a>
        </h3>
        <div className="clientProfilePage_otherSection_innerWrapper">
          {firstThreeRooms?.map((chat, i) => (
            <div key={i} className="singleChat_container">
              <div className="chefImg_container">
                <Image
                  src={
                    chat?.profilePic
                      ? chat?.profilePic
                      : `/images/chef_drawing_one.png`
                  }
                  width={150}
                  height={150}
                  alt="chef image"
                  className={`singleChat_pic`}
                />
              </div>
              <div className="chatDetails_container">
                <p className="chat_chefName">{chat?.chefName}</p>
                <p className="chat_lastMessage">
                  {chat?.lastMessage.length > 60
                    ? chat?.lastMessage.slice(0, 60) + "..."
                    : chat?.lastMessage}
                </p>
              </div>
              <div className="chatdate_container">
                <p className="lastMessage_date">{chat?.timeStamp}</p>
              </div>
            </div>
          ))}
          {!firstThreeRooms[0] && (
            <div className="noChats_container">
              <Image
                src={`/images/bubble-chat.png`}
                width={150}
                height={150}
                alt="chef drawing"
                className={`selectMessage_Icon`}
              />
              <p>You have no message</p>
            </div>
          )}
        </div>
      </div>
      <EditProfile />
    </div>
  );
};

export default ClientProfile;

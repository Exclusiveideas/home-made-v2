import { v4 as uuidv4 } from "uuid";

import { storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getUserProfile } from "@/api";

export const calculateDistanceApart = (userPosition, ChefPosition) => {
  // function to calculate distance between 2 users
  if(!userPosition?.longitude || !ChefPosition?.longitude) return null

  const { latitude: lat1, longitude: lon1 } = userPosition;
  const { latitude: lat2, longitude: lon2 } = ChefPosition; 
  
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return (R * c).toFixed(2); // Distance in kilometers
};

export const refreshUser = async (userID, updateUser, setEnqueueSnack) => {
  setEnqueueSnack({ 
    message: `refreshing user`, 
    type: "info"
  });
  try {
    const response = await getUserProfile(userID);

    if (response?.status == 500) {
      throw new Error(response?.errorMessage || "An error occurred while fetching the user profile.");
    } else {
      updateUser(response?.userProfile);
    }
  } catch (error) {
    setEnqueueSnack({ 
      message: `Error refreshing user details - ${error.message || "Unknown error"}`, 
      type: "error"
    });
  }
};


export const uploadPic = async (
  profilPicFile,
  setChefInfo,
  setEnqueueSnack
) => {
  if (!profilPicFile) {
    return { status: 500, profilePic: null };
  }

  setEnqueueSnack({
    message: "Uploading your profile picture...",
    type: "info",
  });

  const storageRef = ref(storage, `homeMade/profilePic/${uuidv4()}`);
  const uploadTask = uploadBytesResumable(storageRef, profilPicFile);

  try {
    // Wrap the upload process in a Promise
    const uploadResult = await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          setEnqueueSnack({
            message: "Image upload failed - try again.",
            type: "error",
          });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setChefInfo &&
              setChefInfo((prev) => ({ ...prev, profilePic: downloadURL }));
            resolve(downloadURL);
          } catch (error) {
            setEnqueueSnack({
              message: "Failed to get download URL - try again.",
              type: "error",
            });
            reject(error);
          }
        }
      );
    });

    setEnqueueSnack({
      message: "Profile picture upload successful.",
      type: "success",
    });
    return { status: 200, profilePic: uploadResult };
  } catch (error) {
    return { status: 500, profilePic: null };
  }
};

export const uploadImage = async (imageFile, location, setEnqueueSnack) => {

  const storageRef = ref(storage, `homeMade/${location}/${uuidv4()}`);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);

  try {
    const downloadURL = await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null, 
        (error) => reject(error), 
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (error) {
            reject(error);
          }
        }
      );
    });

    return downloadURL
  } catch (error) {
    setEnqueueSnack({ message: `Image upload failed - try again.`, type: "error" });
  }
};

export function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const isPM = hours >= 12;

  // Convert to 12-hour format
  hours = hours % 12 || 12; // 0 becomes 12

  // Format minutes to always have two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const meridiem = isPM ? "pm" : "am";

  return `${hours}:${formattedMinutes} ${meridiem}`;
}

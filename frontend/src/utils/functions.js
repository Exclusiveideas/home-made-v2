import { v4 as uuidv4 } from "uuid";

import { storage } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getUserProfile } from "@/api";

export const calculateDistanceApart = (userPosition, ChefPosition) => {
  // function to calculate distance between 2 users
  return "10";
};

export const refreshUser = async (userID, updateUser, setEnqueueSnack) => {
  try {
    const response = await getUserProfile(userID);

    if (response?.status === 500) reject(response?.errorMessage);
    else {
      updateUser(response?.userProfile);
    }
  } catch (error) {
    setEnqueueSnack({ message: "error refreshing page. please reload page to effect changes", type: "error"})
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
            console.log(url)
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


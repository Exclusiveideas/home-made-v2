import axios from "axios";
import { updatedUser } from "@/utils/constants";

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_SERVER_URI });

// Authentication

export const signupUser = async (userDetails) => {
  try {
    const newUser = await API.post("/api/auth/signup", userDetails);
    return { status: 200, newUser };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error creating account. Try again later.",
    };
  }
};

export const loginUser = async (loginDetails) => {
  try {
    const userDetails = await API.post("/api/auth/login", loginDetails);

    return { status: 200, userDetails };
  } catch (error) {
    return { status: 500, errorMessage: "Error logging in. Try again later." };
  }
};

// export const logOutUser = async () => {
//     // Description: Log out the user by clearing their tokens.
//     // Request Parameters: None.

//     // if you're storing the token, don't you need the user's _id to know which token to clear
// }

export const resetUserPassword = async (resetDetails) => {
  // resetDetails = {
  //     email: '',
  //     name: '',
  //     newPassword: '',
  // }
  
  return { status: 200, confirmationMessage: '' };

  try {
    const confirmationMessage = await API.post("/api/auth/reset", resetDetails);

    return { status: 200, confirmationMessage };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error resetting password. Try again later.",
    };
  }
};

// User

export const getUserProfile = async (userID) => {
  // return { status: 200, userProfile: updatedUser };
  try {
    const userProfile = await API.get(`/api/auth/profile?userID=${userID}`);

    return { status: 200, userProfile };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error fetching user's profile. Try again later.`,
    };
  }
};

export const updateUserProfile = async (updatedInfo) => {
  return { status: 200, updatedUser: updatedUser };
  try {
    const updatedUser = await API.put("/api/profile/update", updatedInfo);

    return { status: 200, updatedUser };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error updating user's profile. Try again later.`,
    };
  }
};

// export const deleteUser = async (userID) => {

//     try {
//         const confirmationMessage = await API.delete('/api/profile/delete', userID)

//         return { status: 200, confirmationMessage }

//     } catch (error) {
//         return { status: 500, errorMessage: `Error deleting your account. Try again later.`}
//     }
// }

export const getAllChefs = async () => {
  try {
    const allChefs = await API.get("/api/chefs");

    return { status: 200, allChefs };
  } catch (error) {
    return { status: 500, errorMessage: `Error fetching chefs. Reload page.` };
  }
};

// Dishes

export const createDish = async (newDishDetails) => {
  return { status: 200, newDish: {} };

  try {
    const newDish = await API.post("/api/dish/create", newDishDetails);

    return { status: 200, newDish };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error creating dish. Try again later.",
    };
  }
};

export const getAllDish = async () => {
  try {
    const allDish = await API.get("/api/dish");

    return { status: 200, allDish };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error fetching all dish. Reload page.`,
    };
  }
};

// export const getOneDish = async (dishID) => {
//     // dishID

//     try {
//         const fetchedDish = await API.get(`/api/dish/:${dishID}`)

//         return { status: 200, fetchedDish }

//     } catch (error) {
//         return { status: 500, errorMessage: `Error fetching dish. Try again later.`}
//     }
// }

export const updateDish = async (updatedDishInfo) => {
  return { status: 200, updatedDish: {} };

  try {
    const updatedDish = await API.put(`/api/dish/update`, updatedDishInfo);

    return { status: 200, updatedDish };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error updating dish. Try again later.`,
    };
  }
};

export const deleteDish = async (dishID) => {
  return { status: 200, confirmationMessage: "" };

  try {
    const confirmationMessage = await API.delete(
      `/api/dish/delete?dishID=${dishID}`
    ); // there's a mistake in their route

    return { status: 200, confirmationMessage };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error deleting dish. Try again later.`,
    };
  }
};

// Employment

export const createEmployment = async (newEmploymentDetails) => {
  try {
    const newEmployment = await API.post(
      "/api/employment/create",
      newEmploymentDetails
    );

    return { status: 200, newEmployment };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error creating employment. Try again later.",
    };
  }
};

export const updateEmployment = async (updatedEmploymentInfo) => {
  return { status: 200, updatedEmployment: {} };

  try {
    const updatedEmployment = await API.put(
      `/api/employment/update/`,
      updatedEmploymentInfo
    );

    return { status: 200, updatedEmployment };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error updating employment. Try again later.`,
    };
  }
};

export const deleteEmployment = async (employmentID) => {
  return { status: 200, confirmationMessage: "successfully deleted" };

  try {
    const confirmationMessage = await API.delete(
      `/api/employment/deleteemploymentID=${employmentID}`
    );

    return { status: 200, confirmationMessage };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error deleting employment. Try again later.`,
    };
  }
};

// certifications

export const createCertification = async (newCertificationDetails) => {
  // newCertificationDetails = certification Details
  return { status: 200, newCertification: "" };

  try {
    const newCertification = await API.post(
      "/api/certification/create",
      newCertificationDetails
    );
    // newCertification = newCertificationDetails

    return { status: 200, newCertification };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error creating certification. Try again later.",
    };
  }
};

export const deleteCertification = async (certificationID) => {
  return { status: 200, confirmationMessage: "successfully deleted" };

  try {
    const confirmationMessage = await API.delete(
      `/api/certification/delete?certificationID=${certificationID}`
    );

    return { status: 200, confirmationMessage };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error deleting certification. Try again later.`,
    };
  }
};

// Chats

export const createChatRoom = async (participantsInfo) => {
  try {
    const newChatRoom = await API.post(
      "/api/chatRoom/create",
      participantsInfo
    );

    return { status: 200, newChatRoom };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error routing to chat room. Try again later.",
    };
  }
};


export const fetchUserChatRooms = async (userID) => {
  try {
    const allChatRooms = await API.get(
      `/api/chatRooms/fetch?userID=${userID}`
    );

    // allChatRooms = [
      // {
      //   _id: '', // a chatroom ID
      //   secondMember: {
      //     name: '', // name of the second participant
      //     image: '' // picture of the second participant
      //   },  
      //   lastMessage: {
      //     message: '', // last message of this chatroom
      //     timeCreated: '', // time message was Created
      //   }, 

      // }
    // ]

    return { status: 200, allChatRooms };
  } catch (error) {
    return { status: 500, errorMessage: "Error fetching chats rooms. reload page." };
  }
};

export const fetchChatRoomDetails = async (chatRoomID) => {
  try {
    const chatRoomDetails = await API.get(
      `/api/chatRoom/fetch?chatRoomID=${chatRoomID}`
    );

    return { status: 200, chatRoomDetails };
  } catch (error) {
    return { status: 500, errorMessage: "Error fetching chats. reload page." };
  }
};

// Message

export const createMessage = async (messageDetails) => {
  return { status: 200, newMessage: "" };

  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  const timeCreated = `${hours}:${minutes}`;

  const newMssgDetails = {
    senderID: messageDetails?.senderID,
    message: messageDetails?.message,
    time: timeCreated,
    chatRoomID: messageDetails?.chatRoomID,
  };

  try {
    const newMessage = await API.post("/api/message/create", newMssgDetails);

    return { status: 200, newMessage };
  } catch (error) {
    return {
      status: 500,
      errorMessage: "Error sending message. Try again later.",
    };
  }
};

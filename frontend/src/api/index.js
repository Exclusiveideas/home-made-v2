import { getCurrentTime } from "@/utils/functions";
import axios from "axios";

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_SERVER_URI });

// Authentication

export const signupUser = async (userDetails) => {
  try {
    const newUser = await API.post("/api/auth/signup", userDetails);
    return { status: 200, newUser: newUser?.data?.user };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error creating account - ${error?.response?.data?.message}`,
    };
  }
};

export const loginUser = async (loginDetails) => {
  try {
    const userDetails = await API.post("/api/auth/login", loginDetails);

    return { status: 200, userDetails: userDetails?.data?.user };
  } catch (error) {
    return { status: 500, errorMessage: `Error logging in - ${error?.response?.data?.message}` };
  }
};


export const resetUserPassword = async (resetDetails) => {

  try {
    const confirmationMessage = await API.post("/api/auth/reset", resetDetails);

    return { status: 200, confirmationMessage: confirmationMessage?.data?.message };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error resetting password - ${error?.response?.data?.message}`,
    };
  }
};



// User

export const getUserProfile = async (userID) => {

  try {
    const userProfile = await API.get(`/api/profile?userID=${userID}`);

    return { status: 200, userProfile: userProfile?.data?.user };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error - ${error?.response?.data?.message}.`,
    };
  }
};

export const updateUserProfile = async (updatedInfo) => {

  try {
    const updatedUser = await API.put("/api/profile/update", updatedInfo);

    return { status: 200, updatedUser: updatedUser?.data };
  } catch (error) {
    console.log('error: ', error)
    return {
      status: 500,
      errorMessage: `Error updating user's profile - ${error?.response?.data?.message}`,
    };
  }
};


export const getAllChefs = async () => {
  try {
    const allChefs = await API.get("/api/chefs");

    return { status: 200, allChefs: allChefs?.data };
  } catch (error) {
    return { status: 500, errorMessage: `Error fetching chefs - ${error?.response?.data?.message}` };
  }
};

// Dishes

export const createDish = async (newDishDetails) => {

  try {
    const newDish = await API.post("/api/dish/create", newDishDetails);

    return { status: 200, newDish };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error creating dish - ${error?.response?.data?.message}`,
    };
  }
};

export const getAllDish = async () => {
  try {
    const allDish = await API.get("/api/dish");

    return { status: 200, allDish: allDish?.data };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error fetching all dish - ${error?.response?.data?.message}`,
    };
  }
};

export const getOneDish = async (dishID) => {

    try {
        const fetchedDish = await API.get(`/api/dish/fetch?dishID=${dishID}`)
        return { status: 200, fetchedDish: fetchedDish?.data };

    } catch (error) {
        return { status: 500, errorMessage: `Error fetching dish - ${error?.response?.data?.message}`}
    }
}

export const updateDish = async (updatedDishInfo) => {

  try {
    const updatedDish = await API.put(`/api/dish/update`, updatedDishInfo);

    return { status: 200, updatedDish: updatedDish?.data };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error updating dish - ${error?.response?.data?.message}`,
    };
  }
};

export const deleteDish = async ({ dishID, chef}) => {

  try {
    const deleteResponse = await API.delete(
      `/api/dish/delete?dishID=${dishID}`,{
        data: { chef },
      }
    );

    return { status: 200, deletedDish: deleteResponse?.data?.deletedDish };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error deleting dish - ${error?.response?.data?.message}`,
    };
  }
};

// Employment

export const createEmployment = async (newEmploymentDetails) => {
  try {
    const newEmployment = await API.post(
      "/api/experience/create",
      newEmploymentDetails
    );

    return { status: 200, updatedUser:  newEmployment?.data};
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error creating employment - ${error?.response?.data?.message}`,
    };
  }
};


export const getOneExperience = async (experienceID) => {

  try {
      const fetchedExperience = await API.get(`/api/experience/fetch?experienceID=${experienceID}`);

      return { status: 200, fetchedExperience: fetchedExperience?.data };
  } catch (error) {
      return { status: 500, errorMessage: `Error fetching experience - ${error?.response?.data?.message}`}
  }
}

export const updateEmployment = async (updatedEmploymentInfo) => {
  try {
    await API.put(`/api/experience/update/`, updatedEmploymentInfo);

    return { status: 200 };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error updating employment - ${error?.response?.data?.message}`,
    };
  }
};

export const deleteEmployment = async ({experienceID, chef}) => {

  try {
    const deleteResponse = await API.delete(
      `/api/experience/delete?experienceID=${experienceID}`,{
        data: { chef },
      }
    );

    return { status: 200, deletedExp: deleteResponse?.data?.deletedExperience };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error deleting employment - ${error?.response?.data?.message}`,
    };
  }
};


// certifications

export const createCertification = async (newCertificationDetails) => {

  try {
    const newCertification = await API.post(
      "/api/certification/create",
      newCertificationDetails
    );

    return { status: 200, updatedUser:  newCertification?.data};
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error creating certification - ${error?.response?.data?.message}`,
    };
  }
};


export const getOneCertification = async (certificationID) => {

  try {
      const fetchedCertification = await API.get(`/api/certification/fetch?certificationID=${certificationID}`);

      return { status: 200, fetchedCertification: fetchedCertification?.data };
  } catch (error) {
      return { status: 500, errorMessage: `Error fetching certification - ${error?.response?.data?.message}`}
  }
}

export const deleteCertification = async ({certificationID, chef}) => {

  try {
    const deleteResponse = await API.delete(
      `/api/certification/delete?certificationID=${certificationID}`,{
        data: { chef },
      }
    );

    return { status: 200, deletedCertification: deleteResponse?.data?.deletedCertification };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error deleting certification - ${error?.response?.data?.message}`,
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

    return { status: 200, newChatRoom: newChatRoom?.data };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error routing to chat room - ${error?.response?.data?.message}`,
    };
  }
};


export const fetchUserChatRooms = async (userID) => {
  try {
    const allChatRooms = await API.get(
      `/api/chatRoom/fetch?userID=${userID}`
    );

    return { status: 200, allChatRooms: allChatRooms?.data };
  } catch (error) {
    return { status: 500, errorMessage: `Error fetching chats rooms - ${error?.response?.data?.message}` };
  }
};

export const fetchChatRoomDetails = async (chatRoomID) => {
  try {
    const chatRoomDetails = await API.get(
      `/api/chatRoom?chatRoomID=${chatRoomID}`
    );

    return { status: 200, chatRoomDetails: chatRoomDetails?.data?.messages };
  } catch (error) {
    return { status: 500, errorMessage: `Error fetching chats - ${error?.response?.data?.message}` };
  }
};

// Message

export const createMessage = async (messageDetails) => {

  const newMssgDetails = {
    senderID: messageDetails?.senderID,
    message: messageDetails?.message,
    time: getCurrentTime(),
    chatRoomID: messageDetails?.chatRoomID,
  };

  try {
    const newMessage = await API.post("/api/message/create", newMssgDetails);

    return { status: 200, newMessage };
  } catch (error) {
    return {
      status: 500,
      errorMessage: `Error sending message - ${error?.response?.data?.message}`,
    };
  }
};

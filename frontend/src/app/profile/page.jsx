"use client";

import "./profilePage.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Navbar from "@/app/components/navbar";
import useProfilePageStore from "@/store/profilePageStore";
import SnackbarComponent from "../components/snackbarComponent";
import ProfilePageSkeleton from '@/profilePageComponents/ProfilePageSkeleton';
import ClientProfile from '@/profilePageComponents/clientProfile';
import ChefProfile from '@/profilePageComponents/chefProfile';
import MenuNav from "../components/menuNav";
import { refreshUser } from "@/utils/functions";

 
const ProfilePage = () => {
  const userInfo = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const enqueueSnack = useProfilePageStore((state) => state.enqueueSnack);
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);
  const enqueueFuncRef = useRef();

  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInfo?._id) {
        router.push(`/auth`);
      } else if (!userInfo?.role) {
        router.push(`/onboarding`);
      }
    }, 1000); 

    return () => clearTimeout(timer);
  }, [userInfo, router]);

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
  
  useEffect(() => {
    if (!userInfo?._id) return
    refreshUser(userInfo?._id, updateUser, setEnqueueSnack);
  }, []);
  

  return (
    <div className="profilePage">
      <Navbar />
      {userInfo?.role == 'client' && (<ClientProfile />)}
      {userInfo?.role == 'chef' && (<ChefProfile />)}
      {!userInfo?.role && <ProfilePageSkeleton /> }
      <MenuNav />
      <SnackbarComponent ref={enqueueFuncRef} />
    </div>
  );
}; 

export default ProfilePage;

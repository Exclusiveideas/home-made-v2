'use client';

import CTABtn from '../ctaBtn';
import './navbar.css';
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import useHomeStore from '@/store/homeStore';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';


const Navbar = ({ homePage }) => {
  const userInfo = useAuthStore((state) => state.user);
  const toggleNavbarOpen = useHomeStore((state) => state.toggleNavbarOpen);
  const isNavbarOpen = useHomeStore((state) => state.isNavbarOpen);
  const setMenuIconClicked = useHomeStore((state) => state.setMenuIconClicked);

  useEffect(() => {
    setMenuIconClicked(false)
  }, [])
  

  const handleNavbarClick = () => {
    toggleNavbarOpen()
    setMenuIconClicked(true);
  }

  return (
    <div className={`navbar_wrapper ${homePage && "homePage"}`}>
      <div className="logo_wrapper">
        <Link href="/">
          <img
            src="/images/site_logo.png"
            alt="homemade logo" 
            className="site_logo"
          />
        </Link>
      </div>
      <div className="navbar_menu_items_container">
        <Link href="/browse" className="navbar_menu_item">
          <p>Browse Chefs</p>
        </Link>
        <Link href="/explore" className="navbar_menu_item">
          <p>Explore Dishes</p>
        </Link>
        {userInfo?._id && (
          <Link href="/chats" className="navbar_menu_item">
            <p>Chats</p>
          </Link>
        )}
        {userInfo?._id ? (
          <>
            <Link href="/profile" className="profilePic_nav_container">
              <Image
                src={
                  userInfo?.profilePic
                    ? userInfo?.profilePic
                    : `/images/chef_drawing_one.png`
                }
                width={100}
                height={100}
                alt="profile picture drawing"
                className={`profilePage_nav_picture`}
              />
            </Link>
          </>
        ) : (
          <CTABtn to="/auth">Join</CTABtn>
        )}
      </div>
      <div className="hamburger_div" onClick={handleNavbarClick}>
        {isNavbarOpen ? <CloseIcon className='menuIcon' /> : <MenuIcon className='menuIcon' />}
      </div>
    </div>
  );
}

export default Navbar
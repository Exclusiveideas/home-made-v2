'use client';

import { useRef, useState } from 'react';
import './auth.css';
import LoginComp from '@/authComponents/login';
import SignUpComp from '@/authComponents/signUp';
import gsap from 'gsap';
import { CustomEase } from "gsap/CustomEase";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';
import MenuNav from '../components/menuNav';

gsap.registerPlugin(CustomEase);


const AuthPage = () => {
  const [showLoginForm, setshowLoginForm] = useState(false)
 
  const authOverlayRef = useRef(null);
  const chefImageOneRef = useRef(null);
  const chefImageTwoRef = useRef(null);

  const router = useRouter();

  const revealLogin = () => {
    setshowLoginForm(true)
    
    if(!chefImageOneRef.current || !chefImageTwoRef.current) return

    const authOverlay = authOverlayRef.current
    const tl = gsap.timeline();

    tl.to(authOverlay, {
      left: 'calc(50% + 1rem)',
      duration: 0.5,
      ease: CustomEase.create("custom", "M0,0 C0.407,0.011 1,0.599 1,1 "),
    })
    .to(chefImageTwoRef.current, { opacity: 1, duration: .7},)
    .to(chefImageOneRef.current, { opacity: 0, duration: .7}, "<")
  }

  const revealSignUp = () => {
    setshowLoginForm(false)
    const authOverlay = authOverlayRef.current;
    const tl = gsap.timeline();


    tl.to(authOverlay, {
      left: "1rem",
      duration: 0.5,
      ease: CustomEase.create("custom", "M0,0 C0.407,0.011 1,0.599 1,1 "),
    })
    .to(chefImageTwoRef.current, { opacity: 0, duration: .7},)
    .to(chefImageOneRef.current, { opacity: 1, duration: .7}, "<")
  };

  const routeUser = (to) => {
    router.push(`/${to}`);
  }
  
  return (
    <div className="auth_page_wrapper">
      <div className="navbarContainer_auth">
        <Navbar />
      </div>
      <div className="bgImageWrapper">
        <Image
          src={`/images/authBg.png`}
          width={1920}
          height={1080}
          alt="chef drawing"
          className={`authBgImg`}
          ref={chefImageTwoRef}
        />
      </div>
      <div className="authPage_innerWrapper">
        <div ref={authOverlayRef} className="authOverlay">
          <div className="authPage_Imgcontainer">
            <Image
              src={`/images/chef_drawing_one.png`}
              width={500}
              height={500}
              alt="chef drawing"
              className={`authPage_Img`}
              ref={chefImageOneRef}
            />
            <Image
              src={`/images/chef_drawing_two.png`}
              width={500}
              height={500}
              alt="chef drawing"
              className={`authPage_Img`}
              ref={chefImageTwoRef}
            />
          </div>
        </div>
        <div
          className={`authPage_innerWrapper_left ${!showLoginForm && "hidden"}`}
        >
          <LoginComp revealSignUp={revealSignUp} routeUser={routeUser} />
        </div>
        <div
          className={`authPage_innerWrapper_right ${showLoginForm && "hidden"}`}
        >
          <SignUpComp revealLogin={revealLogin} routeUser={routeUser} />
        </div>
      </div>
      <MenuNav />
    </div>
  );
}

export default AuthPage
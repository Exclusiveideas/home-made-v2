'use client';

import Image from 'next/image';
import './heroSection.css';
import React, { useEffect, useRef } from 'react';
import useHomeStore from '@/store/homeStore';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const [isImageLoading, setImageLoading] = React.useState(0);
  const setCursorImage = useHomeStore((state) => state.setCursorImage);

  const incrementImgLoaded = () => {
    setImageLoading(prev => prev + 1)
  }

  const changeCursor = () => {
    setCursorImage('spatula')
  }

  const heroSectionRef = useRef(null);

  useEffect(() => {
    if (!heroSectionRef?.current) return

    const tlAnimation = gsap.timeline();
    const heroSection = heroSectionRef?.current;
    console.log("hero: ", heroSection);

    tlAnimation.to(heroSection, {
      filter: "blur(8px)",
      duration: 1,
      scrollTrigger: {
        trigger: heroSection,
        start: "bottom 40%",
        endTrigger: heroSection,
        scrub: 1,
      },
    });
  }, []); 

  return (
    <div onMouseOver={changeCursor} ref={heroSectionRef} className="heroSection_wrapper">
      <div className="heroInfo_container">
        <h1 className="hero_title">Savor the <span className='hero_title_caveat'>Taste</span> of Home, <br /> Made Just for <span className="hero_title_underline">You</span></h1>
        <p className="hero_tagline">We believe that the best meals are made with love and shared with others. <br />
          <span className="hero_tagline_colored">Hire</span> skilled chefs to create delicious deals in the comfort of your <span className="hero_tagline_bordered">home.</span>
        </p>
      </div>
      <div className="heroSection_dishes_container">
      <Image
          src={"/images/hero_dish_one.png"}
          width={500}
          height={500}
          alt="HomeMade dishes"
          priority={true}
          onLoad={() => incrementImgLoaded()}
        className={`heroDish ${isImageLoading < 3 ? 'blur' : 'remove-blur'}`}
        />
      <Image
          src={"/images/hero_dish_two.png"}
          width={600}
          height={600}
          alt="HomeMade dishes"
          priority={true}
          onLoad={() => incrementImgLoaded()}
        className={`heroDish ${isImageLoading < 3 ? 'blur' : 'remove-blur'}`}
        />
      <Image
          src={"/images/hero_dish_three.png"}
          width={600}
          height={600}
          alt="HomeMade dishes"
          priority={true}
          onLoad={() => incrementImgLoaded()}
        className={`heroDish ${isImageLoading < 3 ? 'blur' : 'remove-blur'}`}
        />
      </div>
    </div>
  )
}

export default HeroSection
"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import JellyBlob from "@/homePageComponents/cursorCircle";
import { ParallaxProvider } from "react-scroll-parallax";
import HeroSection from "@/homePageComponents/heroSection";
import HomeSectOne from "@/homePageComponents/homeSectOne";
import HomeSectTwo from "@/homePageComponents/homeSectTwo";
import HomeSectThree from "@/homePageComponents/homeSectThree";
import Footer from "./components/footer";
import MenuNav from "./components/menuNav";
import Navbar from "./components/navbar";

const SmoothScrolling = dynamic(() => import("./components/smoothScrolling"), {
  ssr: false,
});

export default function Home() {

  gsap.registerPlugin(ScrollTrigger);

  const mainCont_ref = useRef(null);

  return (
    <SmoothScrolling>
      <div className={styles.page}>
        <main className={styles.mainContent} ref={mainCont_ref}>
          <Navbar homePage={true} />
          <HeroSection />
          <ParallaxProvider scrollAxis="vertical">
            <HomeSectOne />
          </ParallaxProvider>
          <HomeSectTwo mainCont_ref={mainCont_ref} />
          <HomeSectThree />
          <Footer />
        </main>
        <JellyBlob />
        <MenuNav />
      </div>
    </SmoothScrolling>
  );
}

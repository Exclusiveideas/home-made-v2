"use client";

import Image from "next/image";
import "./homeSectTwo.css";
import SimpleSteps from "../simpleSteps";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import useHomeStore from "@/store/homeStore";

gsap.registerPlugin(ScrollTrigger);

const stepsDetails = [
  {
    title: "Create Your Profile",
    description:
      "Sign up and create your profile. Tell us a bit about your home and what dishes you like. This helps us match you with the best professionals.",
    asociatedImg: "login_step.png",
    bgColor: "#ff9747",
    blob: "step_one_blob.svg",
  },
  {
    title: "Schedule Your First Service",
    description:
      "Browse through available chefs and dishes and choose what you need. Set a date and time that works for you and we'll handle the RestartAlt.",
    asociatedImg: "schedule.png",
    bgColor: "#007A97",
    blob: "step_two_blob.svg",
  },
  {
    title: "Enjoy a HomeMade Home",
    description:
      "Sit back and relax as our skilled professionals take care of your home. Enjoy the convenience and peace of mind that comes with a well-prepared meal.",
    asociatedImg: "meals_step.png",
    bgColor: "#00613B",
    blob: "step_three_blob.svg",
  },
];

const HomeSectTwo = ({ mainCont_ref }) => {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {

    if(!mainCont_ref.current) return;
 
    const container = containerRef.current;
    const horizontal = horizontalRef.current;

    const horizontalScrollLength =
      horizontal.scrollWidth * 1.03 - container.offsetWidth;
      

    // Pinning and Horizontal Scrolling
    gsap.to(horizontal, {
      x: -horizontalScrollLength, // Move horizontally to the end
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "bottom bottom",
        end: () => `+=${horizontalScrollLength}`,
        pin: mainCont_ref.current,
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);
  
  const setCursorImage = useHomeStore((state) => state.setCursorImage);


  const changeCursor = () => {
    setCursorImage('notes')
  }


  return (
    <div ref={containerRef} onMouseOver={changeCursor} className="homeSectTwo_wrapper">
      <div ref={horizontalRef} className="homeSectTwo_innerWrapper">
        <div className="mini_info_container">
          <Image
            src={"/images/home.svg"}
            width={50}
            height={50}
            alt="home icon dishes"
            className={`homeIcon`}
          />
          <p className="mini_info_infoTxt">
            Our app connects you with trusted professionals to handle all your
            nutrition needs
          </p>
        </div>
        <div className="steps_wrapper">
          {stepsDetails?.map((stepDets, i) => (
            <SimpleSteps key={i} stepDets={{ ...stepDets, index: i + 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSectTwo;

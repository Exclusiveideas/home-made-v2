'use client'

import Image from "next/image";
import "./homeSectOne.css";
import { useParallax } from "react-scroll-parallax";
import useHomeStore from "@/store/homeStore";

const HomeSectOne = () => {
  const chicken_parallax = useParallax({
    speed: -20,
  });
  const meat_parallax = useParallax({
    speed: 15,
  });
  
  const setCursorImage = useHomeStore((state) => state.setCursorImage);


  const changeCursor = () => {
    setCursorImage('pan')
  }

  return (
      <div onMouseOver={changeCursor} className="homeSectOne_wrapper">
        <div className="upper_layer">
          <Image
            src={"/images/chef_plate.png"}
            width={400}
            height={400}
            alt="Chef with plate"
            className={`chefWithPlate_img`}
          />
          <div className="blob"></div>
        </div>
        <div className="fourSteps_container">
          <h3>
            Just 3 simple steps away from joining the <span>HomeMade</span>{" "}
            Journey.
          </h3>
        </div>  

        <div className="drawings_container">
          <Image
            src={"/images/chicken.png"}
            width={353}
            height={234}
            alt="food"
            ref={chicken_parallax.ref}
            className="food_image chicken"
          />
          <Image
            src={"/images/covered_plate.png"}
            width={287}
            height={240}
            alt="food"
            className={`food_image covered_plate`}
          />
          <Image
            src={"/images/huge_meat.png"}
            width={328}
            height={186}
            alt="food"
            ref={meat_parallax.ref}
            className={`food_image huge_meat`}
          />
          <Image
            src={"/images/cup.png"}
            width={70}
            height={236}
            alt="food"
            className={`food_image cup`}
          />
        </div>
      </div>
  );
};

export default HomeSectOne;

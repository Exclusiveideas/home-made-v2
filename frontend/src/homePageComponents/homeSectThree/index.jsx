import Image from "next/image";
import "./homeSectThree.css";
import useHomeStore from "@/store/homeStore";
import { useRouter } from 'next/navigation';


const HomeSectThree = ({ HomeSectThreeRef }) => {
  const setCursorImage = useHomeStore((state) => state.setCursorImage);
  const router = useRouter();


  const changeCursor = () => {
    setCursorImage('burger')
  }

  const gotoBrowse = () => {
    router.push(`/browse`);
  }

  return (
    <div ref={HomeSectThreeRef} onMouseOver={changeCursor} className="homeSectThree_wrapper">
      <div className="purpose_card left">
        <div className="bordered_card"></div>
        <div className="edge_circle one"></div>
        <div className="edge_circle two"></div> 
        <div className="edge_circle three"></div>
        <div className="edge_circle four"></div>

        <div className="purpose_card_content_wrapper">
          <div className="cardImage_wrapper">
            <Image
              src={"/images/leaf_one.png"}
              width={1081}
              height={1883}
              alt="leaf"
              className={`purpose_card_leaf`}
            />
          </div>

          <div className="cardDesc_wrapper">
            <h3 className="card_title">Private Events</h3>
            <p className="card_description">
              Discover the art of hosting unforgettable private events with our
              start-to-finish service, offering tailored experiences for 2-50
              guests, including full customization.
            </p>
          </div>
          <div className="cardCTA_wrapper" onClick={gotoBrowse}>
            <p className="more_btn">Select</p>
          </div>
        </div>
      </div>
      <div className="purpose_card right">
        <div className="bordered_card"></div>
        <div className="edge_circle one"></div>
        <div className="edge_circle two"></div>
        <div className="edge_circle three"></div>
        <div className="edge_circle four"></div>

        <div className="purpose_card_content_wrapper">
          <div className="cardImage_wrapper">
            <Image
              src={"/images/leaf_two.png"}
              width={500}
              height={1138}
              alt="leaf"
              className={`purpose_card_leaf right`}
            />
          </div>
          <div className="cardDesc_wrapper">
            <h3 className="card_title">Chef for Hire</h3>
            <p className="card_description">
            Experience the ultimate culinary convenience with our versatile Chef for Hire service, 
            ideal for various occasions including long-term stays offering delightful multi-meal experiences.
            </p>
          </div>
          <div className="cardCTA_wrapper" onClick={gotoBrowse}>
            <p className="more_btn">Select</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSectThree;

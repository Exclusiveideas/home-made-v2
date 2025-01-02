import "./footer.css";
import Link from "next/link";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import InstagramIcon from '@mui/icons-material/Instagram';
import useHomeStore from "@/store/homeStore";


const Footer = () => {
  const setCursorImage = useHomeStore((state) => state.setCursorImage);

 
  const changeCursor = () => {
    setCursorImage('question')
  }
 
  return (
    <div onMouseOver={changeCursor} className="footerWrapper">
      <div className="topFooter_wrapper">
        <div className="topFooter_wrapper_left">
          <div className="topFooter_wrapper_left_upperSection">
            <div className="logo_container">
              <Link href="/">
                <img
                  src="/images/site_logo.png"
                  alt="homemade logo"
                  className="site_logo"
                />
              </Link>
            </div>
            <div className="app_name_container">
              <p>HomeMade Kitchens</p>
            </div>
            <hr />
          </div>
          <div className="topFooter_wrapper_left_lowerSection">
            <a href="mailto:homemade@gmail.com" className="contactItem">
              <MailOutlineIcon className="contact_icon" />
              <p className="contactinfo">
                homemade@gmail.com
              </p>
            </a>
            <a href="tel:+231-739-233-2334" className="contactItem">
              <CallIcon className="contact_icon" />
              <p className="contactinfo">
                739-233-2334
              </p>
            </a>
            <a href="http://www.instagram.com/homemade/" className="contactItem">
              <InstagramIcon className="contact_icon" />
              <p className="contactinfo">
                @homemade
              </p>
            </a>
          </div>
        </div>
        <div className="topFooter_wrapper_right">
          <p>Bring award-winning talent to your in-home events</p>
          <a href="mailto:homemade@gmail.com"><div className="inquireBtn">Inquire Here</div></a>
        </div>
      </div>
      <div className="bottomFooter_wrapper">
        <p>© {new Date().getFullYear()} HomeMade Kitchens. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

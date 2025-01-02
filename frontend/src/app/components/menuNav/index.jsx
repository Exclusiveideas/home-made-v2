import { Poppins } from 'next/font/google';
import './menuNav.css';
import useHomeStore from '@/store/homeStore';
import Link from "next/link";
import Image from 'next/image';
import CTABtn from '../ctaBtn';
import useAuthStore from '@/store/authStore';


const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500'], 
    display: 'swap',   
  });
 

const MenuNav = () => {
  const userInfo = useAuthStore((state) => state.user);
  const isNavbarOpen = useHomeStore((state) => state.isNavbarOpen);
  const toggleNavbarOpen = useHomeStore((state) => state.toggleNavbarOpen);
  const menuItemClicked = useHomeStore((state) => state.menuItemClicked);

  
  const wrapperClass = `menuNavWrapper ${menuItemClicked == false ? 'justLoaded' : (!isNavbarOpen ? 'isClose' : 'isOpen')}`;
  const containerClass = `menuContainer ${poppins.className} ${!isNavbarOpen ? 'isClose' : 'isOpen'}`; 

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>
        <div className="menuNavbar_items">
          <Link href="/browse" className="navbar_menu_item" onClick={toggleNavbarOpen}>
            <p>Browse Chefs</p>
          </Link>
          <Link href="/explore" className="navbar_menu_item" onClick={toggleNavbarOpen}>
            <p>Explore Dishes</p>
          </Link>
          {userInfo?._id && (
            <Link href="/chats" className="navbar_menu_item" onClick={toggleNavbarOpen}>
              <p>Chats</p>
            </Link>
          )}
          {userInfo?._id ? (
            <>
              <Link href="/profile" className="profilePic_nav_container" onClick={toggleNavbarOpen}>
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
      </div>
    </div>
  );
}; 

export default MenuNav;
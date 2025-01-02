import useHomeStore from '@/store/homeStore';
import './ctaBtn.css';
import Link from "next/link";


const CTABtn = ({ children, to }) => {
  
  const toggleNavbarOpen = useHomeStore((state) => state.toggleNavbarOpen);
  
  return (
    <Link href={to ?? '/'} className='ctaBtn_wrapper' onClick={toggleNavbarOpen}>
        {children}
    </Link>
  )
}

export default CTABtn
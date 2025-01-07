import { Skeleton } from '@mui/material';
import './profilePageSkeleton.css';

const ProfilePageSkeleton = () => {
  return ( 
    <div className='ProfileSkeleton_container'>
      <Skeleton className='profile_circleSkeleton' variant="circular" animation="wave" height={200} />
      <div className="profile_textSkel_div">
        <Skeleton className='profile_textSkeleton' variant="text" animation="wave" height={40} />
        <Skeleton className='profile_textSkeleton' variant="text" animation="wave" height={40} />
      </div>
      <Skeleton className='profile_rectSkeleton' variant="rounded" animation="wave" height={300} />
    </div>
  )
} 

export default ProfilePageSkeleton

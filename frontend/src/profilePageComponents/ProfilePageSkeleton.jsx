import { Skeleton } from '@mui/material';
import './profilePageSkeleton.css';

const ProfilePageSkeleton = () => {
  return ( 
    <div className='ProfileSkeleton_container'>
      <Skeleton className='circleSkeleton' variant="circular" animation="wave" height={200} />
      <div className="textSkel_div">
        <Skeleton className='textSkeleton' variant="text" animation="wave" height={40} />
        <Skeleton className='textSkeleton' variant="text" animation="wave" height={40} />
      </div>
      <Skeleton className='rectSkeleton' variant="rounded" animation="wave" height={300} />
    </div>
  )
}

export default ProfilePageSkeleton

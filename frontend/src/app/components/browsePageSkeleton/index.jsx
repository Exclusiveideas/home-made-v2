import { Skeleton } from '@mui/material';
import './browsePageSkeleton.css';

const BrowsePageSkeleton = () => {
  return (
    <div className='browsePageSkeleton_container'>
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
        <Skeleton className='browse_rectSkeleton' variant="rounded" animation="wave" height={200} />
    </div>
  )
} 

export default BrowsePageSkeleton
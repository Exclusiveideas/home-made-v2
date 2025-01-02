"use state";

import "./enlargeImageComp.css";
import Backdrop from "@mui/material/Backdrop";
import useProfilePageStore from "@/store/profilePageStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Image from "next/image";

const EnlargeImageComp = () => {
  const enlargeImage = useProfilePageStore((state) => state.enlargeImage);
  const setEnlargeImage = useProfilePageStore((state) => state.setEnlargeImage);

  const handleClose = () => {
    setEnlargeImage("");
  };

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={enlargeImage}
    >
      {enlargeImage && (
        <div className="enlargeImageComp_wrapper">
          <CloseOutlinedIcon
            sx={{ fontSize: 30 }}
            onClick={handleClose}
            className="closeIcon"
          />
          <Image
            src={enlargeImage}
            width={600}
            height={600}
            alt="certificate Image"
            className={`certificateImage_enlarged`}
          />
        </div>
      )}
    </Backdrop>
  );
};

export default EnlargeImageComp;

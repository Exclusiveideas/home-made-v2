"use state";

import "./editProfile.css";
import Backdrop from "@mui/material/Backdrop";
import { useEffect, useState } from "react";
import { updateDish } from "@/api";
import { refreshUser } from "@/utils/functions";
import useProfilePageStore from "@/store/profilePageStore";
import useAuthStore from "@/store/authStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { CircularProgress } from "@mui/material";

const EditDishComp = ({ userInfo }) => {
  const [dishName, setDishName] = useState("");
  const [dishDesc, setDishDesc] = useState("");
  const [isEditingDish, setIsEditingDish] = useState(false);

  const editDish = useProfilePageStore((state) => state.editDish);
  const setEditDish = useProfilePageStore((state) => state.setEditDish);
  const setExpandedDishDetails = useProfilePageStore(
    (state) => state.setExpandedDishDetails
  );

  const updateUser = useAuthStore((state) => state.updateUser);
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const createDishResponse = await editDishFunc();

    setIsEditingDish(false);
    if (createDishResponse?.status == 500) {
      setEnqueueSnack({
        message: createDishResponse?.errorMessage,
        type: "error",
      });
      return;
    } else {
      setEnqueueSnack({
        message: `Dish has been updated successfully`,
        type: "success",
      });
    }

    refreshUser(userInfo?._id, updateUser, setEnqueueSnack);

    handleClose();
    setExpandedDishDetails(null);
  };

  const editDishFunc = async () => {
    setIsEditingDish(true);

    try {
      const response = await updateDish({
        ...editDish,
        name: dishName,
        description: dishDesc,
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  const handleClose = () => {
    if(isEditingDish) {
      return
    }
    setEditDish(null);
  };

  useEffect(() => {
    if (!editDish?.name) return;

    setDishName(editDish?.name);
    setDishDesc(editDish?.description);
  }, [editDish]);

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={editDish?.name}
    >
      <div className="editCompWrapper">
        <CloseOutlinedIcon
          sx={{ fontSize: 30 }}
          onClick={handleClose}
          className="closeIcon"
        />
        <h3 className="editComponentTitle">Edit {editDish?.name}</h3>
        <form
          className="editProfileName_form_container"
          onSubmit={handleSubmit}
        >
          <div className="onboard_inputBox fullWith">
            <input
              type="text"
              placeholder="Dish Name"
              name="name"
              id="name"
              className="inputEl"
              required
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
            />
          </div>
          <div className="onboard_inputBox profileOverview editProfile">
            <textarea
              id="description-overview"
              name="descriptionOverview"
              placeholder="Tell us what makes this dish so special."
              rows="3"
              className="inputEl profileOverview editProfile"
              required
              value={dishDesc}
              onChange={(e) => setDishDesc(e.target.value)}
            ></textarea>
          </div>
          <button
            disabled={isEditingDish}
            type="submit"
            className="button editProfileBtn"
          >
            {!isEditingDish ? <span>Update</span> : <CircularProgress size={20} />}
          </button>
        </form>
      </div>
    </Backdrop>
  );
};

export default EditDishComp;

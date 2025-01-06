"use state";

import "./confirmDelete.css";
import Backdrop from "@mui/material/Backdrop";
import useProfilePageStore from "@/store/profilePageStore";
import { useState } from "react";
import { deleteCertification, deleteDish, deleteEmployment } from "@/api";
import useAuthStore from "@/store/authStore";
import { refreshUser } from "@/utils/functions";
import { CircularProgress } from "@mui/material";

const ConfirmDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const userInfo = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setDeletedDishID = useAuthStore((state) => state.setDeletedDishID);
  const setDeletedExperienceID = useAuthStore((state) => state.setDeletedExperienceID);
  const setDeletedCertificationID = useAuthStore((state) => state.setDeletedCertificationID);
  const confirmDelete = useProfilePageStore((state) => state.confirmDelete);
  const setConfirmDelete = useProfilePageStore(
    (state) => state.setConfirmDelete
  );
  const setExpandedDishDetails = useProfilePageStore(
    (state) => state.setExpandedDishDetails 
  );
  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleClose = () => {
    if(isDeleting) {
      return
    }
    setConfirmDelete(null);
  };

  const continueDelete = async () => {
    setIsDeleting(true);
    if (confirmDelete?.label == "employment") {
      await deleteEmp();
    } else if (confirmDelete?.label == "certification") {
      await deleteCert();
    } else if (confirmDelete?.label == "dish") {
      await deleteSelectedDish();
    }
    
    refreshUser(userInfo?._id, updateUser, setEnqueueSnack);
  };

  const deleteCert = async () => {
    const certificationID = confirmDelete?.toDelete?._id;
    if (!certificationID) {
      setEnqueueSnack({ message: "Something went wrong", type: "error" });
      setIsDeleting(false);
      return;
    }

    const deleteCertResponse = await deleteCertification({ certificationID, chef: userInfo?._id });

    if (deleteCertResponse?.status == 500) {
      setEnqueueSnack({
        message: deleteCertResponse?.errorMessage,
        type: "error",
      });
    } else {
      setEnqueueSnack({
        message: "Certification deleted successfully",
        type: "success",
      });
    }

    setDeletedCertificationID(deleteCertResponse?.deletedCertification?._id)

    setIsDeleting(false);
    handleClose();
  };

  const deleteEmp = async () => {
    const experienceID = confirmDelete?.toDelete?._id;
    if (!experienceID) {
      setEnqueueSnack({ message: "Something went wrong", type: "error" });
      setIsDeleting(false);
      return;
    }

    const deleteEmpResponse = await deleteEmployment({ experienceID, chef: userInfo?._id });

    if (deleteEmpResponse?.status == 500) {
      setEnqueueSnack({
        message: deleteEmpResponse?.errorMessage,
        type: "error",
      });
    } else {
      setEnqueueSnack({
        message: `Employment deleted successfully`,
        type: "success",
      });
    }

    setDeletedExperienceID(deleteEmpResponse?.deletedExp?._id)

    setIsDeleting(false);
    handleClose();
  };

  const deleteSelectedDish = async () => {
    const dishID = confirmDelete?.toDelete?._id;
    
    if (!dishID) {
      setEnqueueSnack({ message: "Something went wrong", type: "error" });
      setIsDeleting(false);
      return;
    }

    const deleteDishResponse = await deleteDish({ dishID, chef: userInfo?._id });

    if (deleteDishResponse?.status == 500) {
      setEnqueueSnack({
        message: deleteDishResponse?.errorMessage,
        type: "error",
      });
    } else {
      setEnqueueSnack({
        message: `Dish deleted successfully`,
        type: "success",
      });
    }

    setDeletedDishID(deleteDishResponse?.deletedDish?._id)

    setIsDeleting(false);
    handleClose();
    setExpandedDishDetails(null);
  };

  const preposition = confirmDelete?.label == "employment" ? "at" : "for";
  const placement =
    confirmDelete?.label == "employment"
      ? confirmDelete?.toDelete?.companyName
      : confirmDelete?.toDelete?.title;

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={confirmDelete}
    >
      <div className="confirmDelete_container">
        <h3 className="confirmDeleteTitle">
          Confirm {confirmDelete?.label} Delete
        </h3>
        {confirmDelete?.label != "dish" ? (
          <p>
            Are you sure you want to delete your {confirmDelete?.label} listing{" "}
            {preposition} {placement}
          </p>
        ) : (
          <p>Are you sure you want to delete {confirmDelete?.toDelete?.name}</p>
        )}
        <div className="confirm_cancel_btnContainer">
          <button
            disabled={isDeleting}
            className="button editProfileBtn"
            onClick={handleClose}
          >
            <span>Cancel</span>
          </button>
          <button
            disabled={isDeleting}
            className="button editProfileBtn"
            onClick={continueDelete}
          >
            {!isDeleting ? <span>Delete</span> : <CircularProgress size={20} />}
          </button>
        </div>
      </div>
    </Backdrop>
  );
};

export default ConfirmDelete;

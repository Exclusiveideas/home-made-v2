"use state";

import "./editProfile.css";
import Backdrop from "@mui/material/Backdrop";
import useProfilePageStore from "@/store/profilePageStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import { updateEmployment } from "@/api";

const EditEmploymentSect = () => {
  const editEmploymentSect = useProfilePageStore(
    (state) => state.editEmploymentSect
  );
  const setEditEmploymentSect = useProfilePageStore(
    (state) => state.setEditEmploymentSect
  );

  const handleClose = () => {
    setEditEmploymentSect({});
  };

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={editEmploymentSect.label}
    >
      <div className="editCompWrapper">
        <CloseOutlinedIcon
          sx={{ fontSize: 30 }}
          onClick={handleClose}
          className="editComp_closeIcon"
        />
        <EditComp
          editEmploymentSect={editEmploymentSect}
          handleClose={handleClose}
        />
      </div>
    </Backdrop>
  );
};

export default EditEmploymentSect;

export const EditComp = ({ editEmploymentSect, handleClose }) => {
  const [positionHeld, setPositionHeld] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDuration, setJobDuration] = useState({
    from: "",
    to: "",
  });
  const [jobDesc, setJobDesc] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const setEnqueueSnack = useProfilePageStore((state) => state.setEnqueueSnack);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEmployment = await changeEmploymentValue();

    setIsUpdating(false);

    if (updatedEmployment?.status == 500) {
      setEnqueueSnack({
        message: updatedEmployment?.errorMessage,
        type: "error",
      });
      return;
    } else {
      setEnqueueSnack({
        message: `Employment details updated successfully`,
        type: "success",
      });
    }

    handleClose();
  };

  const changeEmploymentValue = async () => {
    setIsUpdating(true);

    try {
      const response = await updateEmployment({
        ...editEmploymentSect?.toUpdate,
        positionHeld: positionHeld,
        companyName: companyName,
        jobDesc: jobDesc,
        startDate: jobDuration?.from,
        endDate: jobDuration?.endDate,
      });
      return response;
    } catch (error) {
      return { status: 500, errorMessage: "An unexpected error occurred." };
    }
  };

  useEffect(() => {
    if (!editEmploymentSect.toUpdate) return;

    const updateDetails = editEmploymentSect.toUpdate;

    setPositionHeld(updateDetails?.positionHeld);
    setCompanyName(updateDetails?.companyName);
    setJobDesc(updateDetails?.jobDesc);
    setJobDuration({
      from: updateDetails?.startDate,
      to: updateDetails?.endDate,
    });
  }, [editEmploymentSect]);

  return (
    <>
      <h3 className="editComponentTitle">Edit Employment</h3>
      <form className="editProfileName_form_container" onSubmit={handleSubmit}>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="Your Position Held"
            name="name"
            id="name"
            className="inputEl"
            required
            value={positionHeld}
            onChange={(e) => setPositionHeld(e.target.value)}
          />
        </div>
        <div className="onboard_inputBox fullWith">
          <input
            type="text"
            placeholder="Company Name"
            name="name"
            id="name"
            className="inputEl"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="durationContainer">
          <div className="onboard_inputBox jobDuration">
            <span>From</span>
            <input
              type="text"
              placeholder="Company Name"
              name="name"
              id="name"
              className="inputEl"
              required
              value={jobDuration?.from}
              onChange={(e) =>
                setJobDuration({ ...jobDuration, from: e.target.value })
              }
            />
          </div>
          -
          <div className="onboard_inputBox jobDuration">
            <span>To</span>
            <input
              type="text"
              placeholder="Company Name"
              name="name"
              id="name"
              className="inputEl"
              required
              value={jobDuration?.to}
              onChange={(e) =>
                setJobDuration({ ...jobDuration, to: e.target.value })
              }
            />
          </div>
        </div>
        <div className="onboard_inputBox profileOverview editProfile">
          <textarea
            id="description-overview"
            name="descriptionOverview"
            placeholder="Tell us about your experience working here as a chef."
            rows="3"
            className="inputEl profileOverview editProfile"
            required
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>
        </div>
        <button
          disabled={isUpdating}
          type="submit"
          className="button editProfileBtn"
        >
          <span>Change</span>
        </button>
      </form>
    </>
  );
};

const router = require("express").Router();
const { ExperienceModel } = require("../models");

router.post("/employment/create", async (req, res) => {
  const { positionHeld, companyName, startDate, endDate, jobDesc, chef } =
    req.body;

  if (
    !positionHeld ||
    !companyName ||
    !startDate ||
    !endDate ||
    !jobDesc ||
    !chef
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExperience = new ExperienceModel({
      positionHeld,
      companyName,
      startDate,
      endDate,
      jobDesc,
      chef,
    });

    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience); // Return the created experience
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error creating employment history",
        error: err.message,
      });
  }
});


// Update Employment History
router.put("/api/employment/update", async (req, res) => {
  const {
    _id: employmentID,
    chef,
    positionHeld,
    companyName,
    startDate,
    endDate,
    jobDesc,
  } = req.body;

  try {
    const employment = await ExperienceModel.findById(employmentID);

    // Check if the employment history exists
    if (!employment) {
      return res.status(404).json({ message: "Employment history not found" });
    }

    // Ensure the chef is the owner of the employment history
    if (employment.chef.toString() !== chef) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to update this employment history",
        });
    }

    // Update the employment history
    employment.positionHeld = positionHeld || employment.positionHeld;
    employment.companyName = companyName || employment.companyName;
    employment.startDate = startDate || employment.startDate;
    employment.endDate = endDate || employment.endDate;
    employment.jobDesc = jobDesc || employment.jobDesc;

    const updatedEmployment = await employment.save();

    // Return the updated employment history
    res.status(200).json(updatedEmployment);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error updating employment history",
        error: err.message,
      });
  }
});


// Delete Employment History
router.delete("/api/employment/delete", async (req, res) => {
  const { employmentID } = req.query;
  const { chef } = req.body; // The logged-in chef

  try {
    // Find the employment history
    const employment = await ExperienceModel.findById(employmentID);

    // Check if the employment history exists
    if (!employment) {
      return res.status(404).json({ message: "Employment history not found" });
    }

    // Ensure the chef is the owner of the employment history
    if (employment.chef.toString() !== chef) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to delete this employment history",
        });
    }

    // Delete the employment history
    await ExperienceModel.findByIdAndDelete(employmentID);

    res
      .status(200)
      .json({ message: "Employment history deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error deleting employment history",
        error: err.message,
      });
  }
});


module.exports = router;

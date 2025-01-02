const router = require("express").Router();
const { CertificationModel } = require("../models");


// Create a Certification
router.post('/create', async (req, res) => {
    const { title, dateAwarded, description, images, chef } = req.body;
  
    try {
        
      const newCertification = new CertificationModel({
        title,
        dateAwarded,
        description,
        images,
        chef
      });
  
      
      const savedCertification = await newCertification.save();
  
      res.status(200).json(savedCertification);
  
    } catch (err) {
      res.status(500).json({ message: "Error creating certification", error: err.message });
    }
  });
  


// Delete a Certification
router.delete('/delete', async (req, res) => {
    const { certificationID } = req.query;
    const { chef } = req.body; // The logged-in chef
  
    try {
      const certification = await CertificationModel.findById(certificationID);
  
      // Check if the certification exists
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
  
      // Ensure the chef is the owner of the certification
      if (certification.chef.toString() !== chef) {
        return res.status(403).json({ message: "You are not authorized to delete this certification" });
      }
  
      // Delete the certification
      await CertificationModel.findByIdAndDelete(certificationID);
  
      res.status(200).json({ message: "Certification deleted successfully" });
  
    } catch (err) {
      res.status(500).json({ message: "Error deleting certification", error: err.message });
    }
  });




module.exports = router;
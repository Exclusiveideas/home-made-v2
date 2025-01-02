const router = require("express").Router();
const { DishModel } = require("../models");

// Create Dish
router.post("/create", async (req, res) => {
    const { name, description, images, chef } = req.body;
  
    if (!name || !description || !images || !chef) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const newDish = new DishModel({
        name,
        description,
        images,
        chef
      });
  
      const savedDish = await newDish.save();
      res.status(201).json(savedDish);  // Return the created dish
    } catch (err) {
      res.status(500).json({ message: "Error creating dish", error: err.message });
    }
  });
  

//  Fetch all dishes
  router.get("/", async (req, res) => {
    try {
      const dishes = await DishModel.find();  // Fetch all dishes
  
      if (!dishes || dishes.length === 0) {
        return res.status(200).json([]);  // Return empty array if no dishes found
      }
  
      res.status(200).json(dishes);  // Return the list of dishes
    } catch (err) {
      res.status(500).json({ message: "Error fetching dishes", error: err.message });
    }
  });
  

// Update a dish
router.put("/update", async (req, res) => {
    const { _id: dishID, name, description, chef } = req.body;
  
    if (!dishID || !name || !description || !chef) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const updatedDish = await DishModel.findOneAndUpdate(
        { _id: dishID, chef },  // Ensure the chef is the one updating the dish
        { name, description },  // Update the dish name and description
        { new: true }  // Return the updated dish
      );
  
      if (!updatedDish) {
        return res.status(404).json({ message: "Dish not found or you are not the owner" });
      }
  
      res.status(200).json(updatedDish);  // Return the updated dish
    } catch (err) {
      res.status(500).json({ message: "Error updating dish", error: err.message });
    }
  });
  

// Delete a dish
router.delete("/delete", async (req, res) => {
    const { dishID } = req.query;
    const { chef } = req.body;  
  
    if (!dishID) {
      return res.status(400).json({ message: "Dish ID is required" });
    }
  
    try {
        const dish = await DishModel.findById(dishID);
      
        if (!dish) {
          return res.status(404).json({ message: "Dish not found" });
        }
      
        if (dish.chef.toString() !== chef) {
          return res.status(403).json({ message: "You are not authorized to delete this dish" });
        }
        
        const deletedDish = await DishModel.findByIdAndDelete(dishID);
      
        res.status(200).json({ message: "Dish deleted successfully" });
      
      } catch (err) {
        res.status(500).json({ message: "Error deleting dish", error: err.message });
      }
      
  });


module.exports = router;
const express = require('express');
const router = express.Router();
const recipes = require('../models/recipes');


//gets all recipes in a json array
router.get('/', async (req,res) =>{
  const recipesFromDB = await recipes.find();
  
  res.json(recipesFromDB);
})

//retrieve a specific recipe

router.get('/:title', async (req, res) => {
  const recipeTitle = req.params.title;

  try {
    
    const recipe = await recipes.findOne({ title: recipeTitle });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

 //posts a new recipe
 router.post('/', async (req, res) => {
  const { title, ingredients, instructions, cookingtime } = req.body;

  try {
    const existingRecipe = await recipes.findOne({ title });

    if (existingRecipe) {
      return res.status(409).json({ error: 'Recipe already exists' });
    }

    const newRecipe = new recipes({
      title,
      ingredients,
      instructions,
      cookingtime,
    });

    await newRecipe.save();

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


 // PUT endpoint for updating a recipe by ID
 router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existingRecipe = await recipes.findById(id);

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const updatedRecipe = {
      title: req.body.title || existingRecipe.title,
      ingredients: req.body.ingredients || existingRecipe.ingredients,
      instructions: req.body.instructions || existingRecipe.instructions,
      cookingtime: req.body.cookingtime || existingRecipe.cookingtime,
    };

  const result = await recipes.findByIdAndUpdate(id, updatedRecipe, { new: true });

  res.json(result);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server Error' });
}
});

router.delete('/:id', async (req, res) => {

    const { id } = req.params;
  
    try {
      const existingRecipe = await recipes.findById(id);
  
      if (!existingRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      await recipes.findByIdAndDelete(id);
  
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });

  module.exports = router;
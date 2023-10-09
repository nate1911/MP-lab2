//gets all recipes
async function fetchRecipes() {
    try {
        const response = await axios.get('/api/recipes'); // Replace with your API endpoint
        const data = response.data;

        const recipeList = document.getElementById('recipe-list');

        // Loop through the recipe data and create HTML table rows
        data.forEach(recipe => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipe.title || ''}</td>
                <td>${Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}</td>
                <td>${recipe.instructions || ''}</td>
                <td>${recipe.cookingtime ? recipe.cookingtime + ' minutes' : ''}</td>
            `;
            recipeList.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching recipe data:', error);
    }
}


async function searchRecipe() {
    const searchTerm = document.getElementById('search-input')
    .value.trim();

    // Clear the current recipe list
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    // Fetch the specific recipe based on the search term
    try {
        const response = await axios.get(`/api/recipes/${encodeURIComponent(searchTerm)}`);
        const recipe = response.data;

        // Check if a recipe was found
        if (recipe) {
            // Create HTML table row for the found recipe
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipe.title || ''}</td>
                <td>${Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}</td>
                <td>${recipe.instructions || ''}</td>
                <td>${recipe.cookingtime ? recipe.cookingtime + ' minutes' : ''}</td>
            `;
            recipeList.appendChild(row);
        } else {
            // Display a message when no recipe is found
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = `
                <td colspan="4">No matching recipe found.</td>
            `;
            recipeList.appendChild(noResultsRow);
        }
    } catch (error) {
        console.error('Error searching for recipes:', error);
    }
}


// Add an event listener to the search button
document.getElementById('search-button').addEventListener('click', searchRecipe);

// Call the fetchRecipes function to load and display recipes when the page loads
window.onload = fetchRecipes;

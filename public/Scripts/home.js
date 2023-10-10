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
                <td>
                <div class="col-md-6">
                <button class="btn btn-danger delete-button mb-2">Delete</button>
            </div>
            

                </td>
              
            `;
            recipeList.appendChild(row);

            // Add a click event listener to the delete button
            const deleteButton = row.querySelector(".delete-button");
            deleteButton.addEventListener("click", async () => {
                try {
                    console.log(recipe._id)
                    await axios.delete(`/api/recipes/${recipe._id}`); 
                   
                    row.remove();
                } catch (error) {
                    console.error('Error deleting recipe:', error);
                }
            });
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

    try {
        const response = await axios.get(`/api/recipes/${encodeURIComponent(searchTerm)}`);
        const recipe = response.data;

        if (recipe) {
            // Create HTML table row for the found recipe
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipe.title || ''}</td>
                <td>${Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}</td>
                <td>${recipe.instructions || ''}</td>
                <td>${recipe.cookingtime ? recipe.cookingtime + ' minutes' : ''}</td>
                <td>
                    <button class="btn btn-danger delete-button">Delete</button>
                </td>
            `;
            recipeList.appendChild(row);

            const deleteButton = row.querySelector(".delete-button");
            deleteButton.addEventListener("click", async () => {
                try {
                    console.log(recipe._id)
                    await axios.delete(`/api/recipes/${recipe._id}`);
                   
                    row.remove();
                } catch (error) {
                    console.error('Error deleting recipe:', error);
                }
            });
        } else {
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


document.getElementById('search-button').addEventListener('click', searchRecipe);

window.onload = fetchRecipes;

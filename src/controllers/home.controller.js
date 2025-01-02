import pool from "../config/db.js";


// const home_view = async (req, res) => {
//     const [articles] = await pool.query("SELECT * FROM article ORDER BY publish_date DESC LIMIT 3 ");

//     const [recipes] = await pool.query("SELECT recipe.id, label, GROUP_CONCAT(url SEPARATOR ',') AS images FROM recipe JOIN recipe_image ON recipe.id = recipe_image.recipe_id JOIN recipeimage ON recipe_image.recipeimage_id = recipeimage.id GROUP BY recipe.id LIMIT 3");

//     const [countries] = await pool.query("SELECT * FROM country JOIN countryimage ON countryimage.id = countryimage_id LIMIT 3");

//     for (const recipe of recipes) {
//         const formattedImages = recipe.images.split(",");
//         recipe.images = formattedImages;
//     }
    
//     res.render("app/template", { template: "home", articles, recipes, countries });
// }

const home_view = async (req, res) => {
    const connection = await pool.getConnection(); // Obtenir une connexion

    try {
        // Démarrer une transaction
        await connection.beginTransaction();

        // Exécuter les requêtes en parallèle pour réduire le temps global
        const [articles] = await connection.query("SELECT * FROM article ORDER BY publish_date DESC LIMIT 3");

        const [recipes] = await connection.query(`
            SELECT 
                recipe.id, 
                recipe.label, 
                GROUP_CONCAT(recipeimage.url SEPARATOR ',') AS images 
            FROM recipe 
            JOIN recipe_image ON recipe.id = recipe_image.recipe_id 
            JOIN recipeimage ON recipe_image.recipeimage_id = recipeimage.id 
            GROUP BY recipe.id 
            LIMIT 3
        `);

        const [countries] = await connection.query(`
            SELECT 
                country.*, 
                countryimage.url AS image_url 
            FROM country 
            JOIN countryimage ON countryimage.id = countryimage_id 
            LIMIT 3
        `);

        // Commit de la transaction
        await connection.commit();

        // Transformer les données 
        const formattedRecipes = recipes.map(recipe => ({
            ...recipe,
            images: recipe.images ? recipe.images.split(",") : []
        }));
console.log(countries)
        // Rendre la vue avec les données formatées
        res.render("app/template", { template: "home", articles, recipes: formattedRecipes, countries });
    } catch (error) {
        // Rollback en cas d'erreur
        await connection.rollback();
        console.error(error);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        connection.release(); // Libérer la connexion
    }
};


export { home_view }
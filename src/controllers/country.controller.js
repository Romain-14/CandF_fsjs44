import pool from "../config/db.js";

const country_list_view = async (req , res) => {
    const [countries] = await pool.query(`
        SELECT 
            country.*, 
            countryimage.url AS image_url 
        FROM country 
        JOIN countryimage ON countryimage.id = countryimage_id
    `);

    res.render("app/template", { template: "country/index", countries });
}

const country_search = async (req, res) => {
    // query stock les options de query dans l'url après le "?"
    // url -> /country/search?country="france"
    console.log(req.query);
    const [countries] = await pool.execute(`
        SELECT 
            country.*, 
            countryimage.url AS image_url 
        FROM country 
        JOIN countryimage ON countryimage.id = countryimage_id
        WHERE country.label LIKE ?
    `, [`%${req.query.country}%`]);

    console.log(countries)
    res.json(countries);
}

export {country_list_view, country_search}
import formidable from "formidable";
import path from "path";
import fs from "fs";

import pool from "../../config/db.js";

const countries_list_view = async (req, res) => {
    const GET_ALL_COUNTRIES = "SELECT country.id, label, url_wiki, flag, url FROM country JOIN countryimage ON countryimage_id = countryimage.id"
    const [countries] = await pool.query(GET_ALL_COUNTRIES);
    console.log(countries)

    res.render("admin/template", {template: "country/index", adminUrl: process.env.ADMIN_URL, countries});
}

const add_country_view = (req, res) => {
    res.render("admin/template", {template: "country/add-form", adminUrl: process.env.ADMIN_URL, error: req.query.error || null});
}

const add_country_action = (req, res) => {
    const form = formidable({ allowEmptyFiles: true, minFileSize: 0 });

    form.parse(req, async (err, fields, files) => {
        console.log(fields);
        console.log(files);
        if (err) {
            console.error('Form parsing error:', err);
            return res.status(500).send('Error parsing the form');
        }

        if (!files.image || !files.image[0]) {
            console.error('Missing image file');
            return res.redirect(process.env.ADMIN_URL + "/country/add?error=MissingFields");
        }

        const oldPath = files.image[0].filepath;
        const newPath = path.join(process.cwd(), 'public', 'images', files.image[0].originalFilename);

        // Copier l'image
        fs.copyFile(oldPath, newPath, async (copyErr) => {
            if (copyErr) {
                console.error('File upload failed:', copyErr);
                return res.status(500).send('File upload failed');
            }

            let connection;
            try {
                // Obtenir une connexion depuis le pool
                connection = await pool.getConnection();

                // Démarrer une transaction
                await connection.beginTransaction();

                // Insérer l'image dans `countryimage`
                const INSERT_IMAGE_URL = "INSERT INTO countryimage (url) VALUES (?)";
                const [resultImage] = await connection.execute(INSERT_IMAGE_URL, [files.image[0].originalFilename]);

                // Insérer le pays dans `country`
                const INSERT_COUNTRY = "INSERT INTO country (label, url_wiki, flag, countryimage_id) VALUES (?, ?, ?, ?)";
                const [resultCountry] = await connection.execute(
                    INSERT_COUNTRY,
                    [fields.label[0], fields.url_wiki[0], fields.flag[0], resultImage.insertId]
                );

                if (resultCountry.insertId) {
                    // Valider la transaction
                    await connection.commit();
                    console.log('Country added successfully');
                    return res.redirect(process.env.ADMIN_URL + "/country");
                } else {
                    throw new Error('Failed to insert country');
                }
            } catch (dbError) {
                console.error('Database error:', dbError);

                // Rollback de la transaction en cas d'erreur
                if (connection) await connection.rollback();

                res.status(500).send('An error occurred while processing your request');
            } finally {
                if (connection) {
                    // Libérer la connexion
                    connection.release();
                }
            }
        });
    });
};


export { countries_list_view, add_country_view, add_country_action }
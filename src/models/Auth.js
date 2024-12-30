import pool from "../config/db.js";

// ici ce fichier a la responabilité d'effectuer les requêtes SQL liées à l'authentification
// utilisation de méthode sur la class "en static"
class Auth{

    static async insertUser(QUERY, alias, hash){
        return await pool.execute(QUERY, [alias, hash]);
    }

}


export default Auth;

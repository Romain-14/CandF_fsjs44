import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import bcrypt from "bcrypt";
const SALT = 10;

import pool from "./config/db.js";

const app = express();

const PORT = process.env.PORT || process.env.LOCAL_PORT;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

// librairie pour logger les requêtes http
// https://www.npmjs.com/package/morgan
app.use(morgan("dev"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie : {
        maxAge: 864000000,
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    }
}));

app.use((req, res, next) => {
       if(req.session.userInfo) {
        console.log(`Welcome ${req.session.userInfo.alias}, membre depuis le ${new Date(req.session.userInfo.creation_date).toLocaleDateString()} à ${new Date(req.session.userInfo.creation_date).toLocaleTimeString()}` )
    }
    next();
});

app.get("/", (req, res) => {
	res.render("template", { template: "home" });
});

app.get("/auth/login", (req, res) => {
	res.render("template", { template: "auth/login" });
});

app.get("/auth/register", (req, res) => {
	res.render("template", { template: "auth/register" });
});

// POST
app.post("/auth/register", async (req ,res) => {
    // verifier si le nom d'utilisateur n'existe pas déjà
    // -> requête (SQL) de récupération d'un utilisateur
    const GET_USER = "SELECT alias FROM user WHERE alias = ?";
    const [[user]] = await pool.execute(GET_USER, [req.body.alias]);
    // si le nom est libre, on peut hashé le mot de passe
    if(!user) {
        const hash = await bcrypt.hash(req.body.password,SALT);
        // si tout s'est bien passé on enregistre le nouvel utilisateur
        // -> requête (SQL) d'insertion
        const INSERT_USER = "INSERT INTO user (alias, password) VALUES (?, ?)";
        const [response] = await pool.execute(INSERT_USER, [req.body.alias, hash]);

        // redirection vers la page de connexion en cas de succès
        if(response.insertId) res.redirect("/auth/login");        
    }

    // si l'utilisateur existe au redirige vers le formulaire de création de compte avec un message d'erreur
    if(user){
        res.send("User exists"); // à modifier en redirection
    }
});


/// connexion 

app.post("/auth/login", async (req, res) => {
    // vérifier que l'utilisateur possède bien un compte 
    const GET_USER = "SELECT alias, password, creation_date  FROM user WHERE alias = ?";
    const [[user]] = await pool.execute(GET_USER, [req.body.alias]);
    
    // sinon le rediriger vers le formulaire de création d'un compte
    if (!user) { 
        res.redirect("/auth/register");
    }
    // s'il possède un compte, vérifier le mot de passe
    if (user) { 
        // ou version raccourci , évaluation direct dans la condition if
        // if (await bcrypt.compare(req.body.password, user.password)) { 
        const isSame = await bcrypt.compare(req.body.password, user.password);
        
        // si les mots de passes correspondent
        // on crée la session en mémoire
        if(isSame) {
            const userInfo = {
                alias: user.alias,
                creation_date: user.creation_date,
            }
            // si tout corresponds on créé la session
            req.session.userInfo = {...userInfo};
            
            // et on redirige vers la page home ou le profil etc..
            res.redirect("/");
        } else {
            // si les mots de passe NE correspondent PAS on redirige sur le formulaire de connexion
            res.redirect("/auth/login");
        }
    }

});

app.listen(PORT, () => console.log("running at http://localhost:" + PORT));

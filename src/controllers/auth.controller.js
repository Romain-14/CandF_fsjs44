import Auth from "../models/Auth.js";
import bcrypt from "bcrypt";
const SALT = 10;

const login_view = (req, res) => {
	res.render("app/template", { template: "auth/login" });
};
const register_view = (req, res) => {
	res.render("app/template", { template: "auth/register" });
};

const logout_action = (req, res) => {
	req.session.destroy(function (err) {
		if (err) console.log(err);
		res.clearCookie("connect.sid");
		res.redirect("/");
	});
};

const create_user_action = async (req, res) => {
	const SELECT_USER = "SELECT alias FROM user WHERE alias = ?";
	const [[user]] = await Auth.findUserByAlias(SELECT_USER, req.body.alias);

	if (!user) {
		const hash = await bcrypt.hash(req.body.password, SALT);
		const INSERT_USER = "INSERT INTO user (alias, password) VALUES (?, ?)";
		const [response] = await Auth.insertUser(
			INSERT_USER,
			req.body.alias,
			hash
		);

		if (response.insertId) res.redirect("/auth/login");
	}

	if (user) {
		res.send("User exists");
	}
};

const login_user_action = async (req, res) => {
	const SELECT_USER =
		"SELECT alias, password, creation_date, isAdmin FROM user WHERE alias = ?";
	const [[user]] = await Auth.findUserByAlias(SELECT_USER, req.body.alias);
	console.log(user);
	if (!user) {
        // si l'utilisateur n'existe pas :
        // 2 choix possibles
        // 1. il n'a pas de compte
        // rediriger vers la page de création de compte
        // envoi d'une query message apprécié pour informer l'utilisateur !
        res.redirect("/auth/register");
        // 2. il s'est trompé dans son identifiant de compte
        // redirection vers le formulaire de connexion
        // avec un message informatif !
    }

	if (user) {
		if (await bcrypt.compare(req.body.password, user.password)) {
			const userInfo = {
				alias: user.alias,
				creation_date: user.creation_date,
				isAdmin: user.isAdmin,
				isLogged: true,
			};
			req.session.userInfo = { ...userInfo };

			if (!user.isAdmin) res.redirect("/");
			if (user.isAdmin) res.redirect(process.env.ADMIN_URL);
		} else res.redirect("/auth/login");
	}
};

export {
	login_view,
	register_view,
	logout_action,
	create_user_action,
	login_user_action,
};

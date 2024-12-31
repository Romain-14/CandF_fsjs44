import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";

import router from "./router/app.routes.js";

const app = express();

const PORT = process.env.PORT || process.env.LOCAL_PORT;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

// app.use(morgan("dev"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: false }));

app.use(
	session({
		secret: process.env.SECRET_SESSION_KEY,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 86400000,
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: "strict",
		},
	})
);

app.use((req, res, next) => {
	if (req.session.userInfo) {
        res.locals = req.session.userInfo;
	}
	if (req.session.userInfo) {
		console.log(
			`Welcome ${req.session.userInfo.alias}, membre depuis le ${new Date(
				req.session.userInfo.creation_date
			).toLocaleDateString()} à ${new Date(
				req.session.userInfo.creation_date
			).toLocaleTimeString()}`
		);
	}
	next();
});

app.use(router);

app.listen(PORT, () => console.log("running at http://localhost:" + PORT));


// ATTENTION en mode DÉVELOPPEMENT UNIQUEMENT !!
console.log(`http://localhost:${PORT}${process.env.ADMIN_URL}`);
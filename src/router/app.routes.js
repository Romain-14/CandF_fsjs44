import { Router } from "express";
import { home_view } from "../controllers/home.controller.js";
import {
	login_view,
	register_view,
	create_user_action,
	login_user_action,
	logout_action,
} from "../controllers/auth.controller.js";
import { admin_view } from "../controllers/admin.controller.js";
import checkAuthAdmin from "../middlewares/checkAuthAdmin.js";
import {
	add_country_action,
	add_country_view,
	countries_list_view,
} from "../controllers/admin/country.controller.js";

const router = Router();

const adminBaseUrl = process.env.ADMIN_URL;

router.get("/", home_view);
router.get("/auth/login", login_view);
router.get("/auth/register", register_view);
router.get("/auth/logout", logout_action);

router.get(adminBaseUrl, checkAuthAdmin, admin_view);
router.get(adminBaseUrl + "/country", checkAuthAdmin, countries_list_view);
router.get(adminBaseUrl + "/country/add", checkAuthAdmin, add_country_view);

// POST
router.post("/auth/register", create_user_action);
router.post("/auth/login", login_user_action);

router.post(adminBaseUrl + "/country/add", checkAuthAdmin, add_country_action)

export default router;

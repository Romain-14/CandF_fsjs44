import { Router } from "express";
import { home_view } from "../controllers/home.controller.js";
import {
	login_view,
	register_view,
	create_user_action,
	login_user_action,
	logout_action,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/", home_view);
router.get("/auth/login", login_view);
router.get("/auth/register", register_view);

router.get("/auth/logout", logout_action);

// POST
router.post("/auth/register", create_user_action);
router.post("/auth/login", login_user_action);

export default router;

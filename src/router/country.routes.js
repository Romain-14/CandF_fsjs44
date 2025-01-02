import { Router } from "express";

import { country_list_view, country_search } from "../controllers/country.controller.js";

const router = Router();

// ici http://localhost:9000/country

router.get("/", country_list_view);
router.get("/search", country_search);


export default router;

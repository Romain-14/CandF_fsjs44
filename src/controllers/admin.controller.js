import pool from "../config/db.js";

const admin_view = (req, res) => {
    res.render("admin/template", {template: "home", adminUrl: process.env.ADMIN_URL});
}




export {admin_view}
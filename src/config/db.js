import mysql from "mysql2/promise";

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
});

pool.getConnection().then((res) => {
	console.log("connected to " + res.config.database + " database !");
});

export default pool;

import pool from "../config/db.js";

class Auth {

	static async findUserByAlias(QUERY, alias) {
		return await pool.execute(QUERY, [alias]);
	}

	static async insertUser(QUERY, alias, hash) {
		return await pool.execute(QUERY, [alias, hash]);
	}
}

export default Auth;

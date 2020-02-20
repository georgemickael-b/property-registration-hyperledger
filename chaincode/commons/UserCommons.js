"use strict";

const User = require("../models/User");
const log = require("loglevel");

/**
 * UserCommons class contains all the functions that access User asset
 * which are called by both Registrar and Users
 */
class UserCommons {
	/**
	 * Get a user account's details from the blockchain
	 * @param ctx - The transaction context
	 * @param name - name of user of request for which to fetch details
	 * @param aadhar - aadhar number of user of request for which to fetch details
	 */
	async viewUser(ctx, name, aadhar) {
		const userKey = User.makeKey([name, aadhar]);
		return await ctx.userList.getUser(userKey).catch(err => {
			log.error(err);
			throw new Error("Cannot get user");
		});
	}
}

module.exports = new UserCommons();

"use strict";

const Property = require("../models/Property");
const log = require("loglevel");

/**
 * PropertyCommons class contains all the functions accessing Property asset
 * which are called by both Registrar and Users
 */
class PropertyCommons {
	/**
	 * Get property details from the blockchain
	 * @param ctx - The transaction context
	 * @param propertyId - propertyId of the property to fetch the details
	 */
	async viewProperty(ctx, propertyId) {
		const propertyKey = Property.makeKey([propertyId]); // property composite key
		return await ctx.propertyList.getProperty(propertyKey).catch(err => {
			log.error(err);
			throw new Error(`Cannot get the property`);
		});
	}
}

//Exported as singleton
module.exports = new PropertyCommons();

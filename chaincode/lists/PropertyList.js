'use strict';

const Property = require('../models/Property');

class PropertyList {
	
	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.lists.property';
	}
	
	/**
	 * Returns the Property model stored in blockchain identified by this key
	 * @param requestKey
	 * @returns {Promise<Property>}
	 */
	async getProperty(requestKey) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestKey.split(':'));
		let requestBuffer = await this.ctx.stub.getState(requestCompositeKey);
		return Property.fromBuffer(requestBuffer);
	}
	
	/**
	 * Adds a request model to the blockchain
	 * @param requestObject {Property}
	 * @returns {Promise<void>}
	 */
	async addProperty(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObject.getKeyArray());
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
	
	/**
	 * Updates a request model on the blockchain
	 * @param requestObject {Property}
	 * @returns {Promise<void>}
	 */
	async updateProperty(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObject.getKeyArray());
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
}

module.exports = PropertyList;
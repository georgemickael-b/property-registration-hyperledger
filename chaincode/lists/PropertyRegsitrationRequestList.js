'use strict';

const PropertyRegsitrationRequest = require('../models/PropertyRegistrationRequest');

class PropertyRegsitrationRequestList {
	
	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.lists.property-registration-request';
	}
	
	/**
	 * Returns the PropertyRegsitrationRequest model stored in blockchain identified by this key
	 * @param requestKey
	 * @returns {Promise<PropertyRegsitrationRequest>}
	 */
	async getPropertyRegsitrationRequest(requestKey) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestKey.split(':'));
		let requestBuffer = await this.ctx.stub.getState(requestCompositeKey);
		return PropertyRegsitrationRequest.fromBuffer(requestBuffer);
	}
	
	/**
	 * Adds a request model to the blockchain
	 * @param requestObject {PropertyRegsitrationRequest}
	 * @returns {Promise<void>}
	 */
	async addPropertyRegsitrationRequest(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObject.getKeyArray());
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
	
	/**
	 * Updates a request model on the blockchain
	 * @param requestObject {PropertyRegsitrationRequest}
	 * @returns {Promise<void>}
	 */
	async updatePropertyRegsitrationRequest(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, key.split(':'));
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
}

module.exports = PropertyRegsitrationRequestList;
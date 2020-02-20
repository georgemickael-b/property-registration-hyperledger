"use strict";

const NewUserRequest = require("../models/NewUserRequest");

class NewUserRequestList {
	constructor(ctx) {
		this.ctx = ctx;
		this.name = "org.property-registration-network.regnet.lists.request";
	}

	/**
	 * Returns the NewUserRequest model stored in blockchain identified by this key
	 * @param requestKey
	 * @returns {Promise<NewUserRequest>}
	 */
	async getRequest(requestKey) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(
			this.name,
			requestKey.split(":")
		);
		let requestBuffer = await this.ctx.stub.getState(requestCompositeKey);
		return NewUserRequest.fromBuffer(requestBuffer);
	}

	/**
	 * Adds a request model to the blockchain
	 * @param requestObject {NewUserRequest}
	 * @returns {Promise<void>}
	 */
	async addRequest(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(
			this.name,
			requestObject.getKeyArray()
		);
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}

	/**
	 * Updates a request model on the blockchain
	 * @param requestObject {NewUserRequest}
	 * @returns {Promise<void>}
	 */
	async updateRequest(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, key.split(":"));
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
}

module.exports = NewUserRequestList;

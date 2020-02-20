'use strict';

const User = require('../models/User.js');

class UserList {
	
	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration-network.regnet.lists.user';
	}
	
	/**
	 * Returns the User model stored in blockchain identified by this key
	 * @param userKey
	 * @returns {Promise<User>}
	 */
	async getUser(userKey) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userKey.split(':'));
		let userBuffer = await this.ctx.stub.getState(userCompositeKey);
		return User.fromBuffer(userBuffer);
	}
	
	/**
	 * Adds a user model to the blockchain
	 * @param userObject {User}
	 * @returns {Promise<void>}
	 */
	async addUser(userObject) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userObject.getKeyArray());
		let userBuffer = userObject.toBuffer();
		await this.ctx.stub.putState(userCompositeKey, userBuffer);
	}
	
	/**
	 * Updates a user model on the blockchain
	 * @param userObject {User}
	 * @returns {Promise<void>}
	 */
	async updateUser(userObject) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userObject.getKeyArray());
		let userBuffer = userObject.toBuffer();
		await this.ctx.stub.putState(userCompositeKey, userBuffer);
	}
}

module.exports = UserList;
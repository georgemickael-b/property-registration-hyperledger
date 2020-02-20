'use strict';

class PropertyRegistrationRequest {
	
	/**
	 * Constructor function
	 * @param requestObject {Object}
	 */
	constructor(requestObject) {
		this.key = PropertyRegistrationRequest.makeKey([requestObject.propertyId]);
		Object.assign(this, requestObject);
	}
	
	/**
	 * Get class of this model
	 * @returns {string}
	 */
	static getClass() {
		return 'org.property-registration-network.regnet.models.PropertyRegistrationRequest';
	}
	
	/**
	 * Convert the buffer stream received from blockchain into an object of this model
	 * @param buffer {Buffer}
	 */
	static fromBuffer(buffer) {
		let json = JSON.parse(buffer.toString());
		return new PropertyRegistrationRequest(json);
	}
	
	/**
	 * Convert the object of this model to a buffer stream
	 * @returns {Buffer}
	 */
	toBuffer() {
		return Buffer.from(JSON.stringify(this));
	}
	
	/**
	 * Create a key string joined from different key parts
	 * @param keyParts {Array}
	 * @returns {*}
	 */
	static makeKey(keyParts) {
		return keyParts.map(part => JSON.stringify(part)).join(":");
	}
	
	/**
	 * Create an array of key parts for this model instance
	 * @returns {Array}
	 */
	getKeyArray() {
		return this.key.split(":");
	}
	
	/**
	 * Create a new instance of this model
	 * @returns {PropertyRegistrationRequest}
	 * @param requestObject {Object}
	 */
	static createInstance(requestObject) {
		return new PropertyRegistrationRequest(requestObject);
	}

}

module.exports = PropertyRegistrationRequest;
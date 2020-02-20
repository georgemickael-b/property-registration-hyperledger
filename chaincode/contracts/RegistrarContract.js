"use strict";

const { Contract, Context } = require("fabric-contract-api");
const User = require("../models/User");
const UserList = require("../lists/UserList");
const NewUserRequest = require("../models/NewUserRequest");
const NewUserRequestList = require("../lists/NewUserRequestList");
const PropertyRegistrationRequest = require("../models/PropertyRegistrationRequest");
const PropertyRegistrationRequestList = require("../lists/PropertyRegsitrationRequestList");
const Property = require("../models/Property");
const PropertyList = require("../lists/PropertyList");
const userCommons = require("../commons/UserCommons");
const propertyCommons = require("../commons/PropertyCommons");
const ACL = require("../ACL");
const log = require("loglevel");

/**
 * Custom Context for RegistrarContract
 */
class RegistrarContext extends Context {
	constructor() {
		super();
		this.userList = new UserList(this);
		this.newUserRequestList = new NewUserRequestList(this);
		this.propertyRegistrationRequestList = new PropertyRegistrationRequestList(this);
		this.propertyList = new PropertyList(this);
	}
}

/**
 * RegistrarContract contains all the function that should be invoked by registrar
 */
class RegistrarContract extends Contract {
	constructor() {
		// Custom name to refer to this smart contract
		super("org.property-registration-network.regnet.contract.registrar");
	}

	// Built in method used to build and return the context for this smart contract on every transaction invoke
	createContext() {
		return new RegistrarContext();
	}

	// Override beforeTransaction method from Contract class
	/*async beforeTransaction(ctx){
		// Allow only the registrar peers to initiate any transaction on this contract 
       // ACL.allowOnlyRegistrar(ctx)
	}*/
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		log.info(`Registrar Smart Contract Instantiated`);
	}

	/**
	 * Approve request and create new user
	 * @param ctx - The transaction context
	 * @param name - name of user of request to approve
	 * @param aadhar - aadhar of user of request to approve
	 * @returns {User} - object of approved user
	 */
	async approveNewUser(ctx, name, aadhar) {
		const newUserRequestKey = NewUserRequest.makeKey([name, aadhar]);
		const userKey = User.makeKey([name, aadhar]);

		// Fetch request with given name and aadhar of the user. throw error is request is not present
		let request = await ctx.newUserRequestList.getRequest(newUserRequestKey).catch(err => {
			log.error(err);
			throw new Error("Request with that name and aadhar is not found");
		});
		// Check if the user is already approved, if so throw error
		let existingUser = await ctx.userList
			.getUser(userKey)
			.catch(err => log.info("User info is unique!"));
		if (existingUser !== undefined) {
			throw new Error("An user with the same name and aadhar already exists.");
		}
		const { phone, email } = request;
		let userObject = {
			name,
			aadhar,
			phone,
			email,
			createdAt: new Date(),
			upgradCoins: 0
		};
		let newUserObject = User.createInstance(userObject);
		await ctx.userList.addUser(newUserObject); // Add user to ledger
		return newUserObject;
	}

	/**
	 * Fetch details of an user
	 * @param ctx - The transaction context
	 * @param name - name of user of request for which to fetch details
	 * @param aadhar - aadhar of user of request for which to fetch details
	 * @returns {User} - object of user
	 */
	async viewUser(ctx, name, aadhar) {
		return await userCommons.viewUser(ctx, name, aadhar);
	}

	/**
	 * Approve property registration request and create a property asset on ledger
	 * @param ctx - The transaction context
	 * @param propertyId - propertyId of the request to approve
	 * @returns {Property} - object of property
	 */
	async approvePropertyRegistration(ctx, propertyId) {
		const requestKey = PropertyRegistrationRequest.makeKey([propertyId]);

		// Check if the request is present
		let request = await ctx.propertyRegistrationRequestList
			.getPropertyRegsitrationRequest(requestKey)
			.catch(err => {
				log.error(err);
				throw new Error(`NewUserRequest with property id ${propertyId} not found`);
			});

		// Check if the property is already approved if so throw error
		let existingProperty = await ctx.propertyList
			.getProperty(requestKey)
			.catch(err => log.info("Property info is unique!"));
		if (existingProperty !== undefined) {
			throw new Error("A property with that property id already exists.");
		}
		const { price, status, owner } = request;
		let requestObject = {
			propertyId,
			price,
			status,
			owner,
			createdAt: new Date()
		};

		let newProperyObject = Property.createInstance(requestObject);
		await ctx.propertyList.addProperty(newProperyObject); // Store the property to the ledger
		return newProperyObject;
	}

	/**
	 * Fetch details of a property
	 * @param ctx - The transaction context
	 * @param propertyId - propertyId of property to fetch details
	 * @returns {Property} - object of property
	 */
	async viewProperty(ctx, propertyId) {
		return await propertyCommons.viewProperty(ctx, propertyId);
	}
}

module.exports = RegistrarContract;

"use strict";

const { Contract, Context } = require("fabric-contract-api");
const User = require("../models/User");
const UserList = require("../lists/UserList");
const PropertyRegistrationRequest = require("../models/PropertyRegistrationRequest");
const Property = require("../models/Property");
const PropertyRegistrationRequestList = require("../lists/PropertyRegsitrationRequestList");
const PropertyList = require("../lists/PropertyList");
const NewUserRequest = require("../models/NewUserRequest");
const NewUserRequestList = require("../lists/NewUserRequestList");
const Validators = require("../validators");
const Utils = require("../utils");
const userCommons = require("../commons/UserCommons");
const propertyCommons = require("../commons/PropertyCommons");
const constants = require("../constansts");
const ACL = require("../ACL")
const log = require("loglevel");

/**
 * Custom Context for UserContract
 */
class UserContext extends Context {
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
class UserContract extends Contract {
	constructor() {
		// Custom name to refer to this smart contract
		super("org.property-registration-network.regnet.contract.user");
	}

	// Built in method used to build and return the context for this smart contract on every transaction invoke
	createContext() {
		return new UserContext();
	}

	/*
	// Override beforeTransaction method from Contract class
	async beforeTransaction(ctx){
		// Allow only the registrar peers to initiate any transaction on this contract
        ACL.allowOnlyUsers(ctx);
	}
	*/
	

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		log.info("User Smart Contract Instantiated");
	}

	/**
	 * Create a new user account on the network
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param email - Email ID of the user
	 * @param phone - phone number of the user
	 * @param aadhar - aadhar number of the user
	 * @returns {UserRequest}
	 */
	async requestNewUser(ctx, name, email, phone, aadhar) {
		// Create a new composite key for the new user account
		const newUserRequestKey = NewUserRequest.makeKey([name, aadhar]);
		const userKey = User.makeKey([name, aadhar]);

		// Fetch request with given name and aadhar of the user if exist throw error else proceed
		let existingRequest = await ctx.newUserRequestList
			.getRequest(newUserRequestKey)
			.catch(err => log.info("Provided request is unique!"));
		if (existingRequest !== undefined) {
			throw new Error(
				`Invalid request. A request with name ${name} and aadhar number ${aadhar} already exist`
			);
		}
		// If an user already exists with the data in the request throw error else proceed
		const existingUser = await ctx.userList.getUser(userKey).catch(err => {
			log.info(`User info is unique for user ${name}`);
		});
		if (existingUser !== undefined)
			throw new Error("User with that details is already present");
		// Create a request object to be stored in blockchain
		let requestObject = {
			name,
			email,
			phone,
			aadhar,
			createdAt: new Date()
		};
		// Create a new instance of User and save it to blockchain
		let newRequestObject = NewUserRequest.createInstance(requestObject);
		await ctx.newUserRequestList.addRequest(newRequestObject);
		return newRequestObject;
	}

	/**
	 * Recharge user account with upgrad coins based on transactionId
	 * @param ctx - The transaction context
	 * @param name - name of user of request for which to recharge
	 * @param aadhar - aadhar of user of request for which to recharge
	 * @param bankTransactionId - transactionId issued by bank fot paying fees
	 * @returns {User}
	 */
	async rechargeAccount(ctx, name, aadhar, bankTransactionId) {
		// Create a new composite key for the new user account
		const userKey = User.makeKey([name, aadhar]);

		// Fetch request with given name and aadhar of the user
		let user = await ctx.userList.getUser(userKey).catch(err => {
			throw new Error("User not found");
		});
		// Validate if the transaction id is in correct format
		if (!Validators.validateBankTransaction(bankTransactionId)) {
			throw new Error("TransactionId is invalid");
		}
		// get upgrad coin value from transaction id
		const upgradCoinsFromTransaction = Utils.getUpgradCoinsFromBankTransaction(
			bankTransactionId
		);
		// update the updgradCoins of the user
		const updatedUpgradCoins = Number(user.upgradCoins) + upgradCoinsFromTransaction;
		let userObject = { ...user, upgradCoins: updatedUpgradCoins };
		let newUserObject = User.createInstance(userObject);
		await ctx.userList.updateUser(newUserObject);
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

	async requestPropertyRegistration(ctx, propertyId, price, status, name, aadhar) {
		// Create a new composite key for the new user account
		const propertyRequestKey = PropertyRegistrationRequest.makeKey([propertyId]);
		const userKey = User.makeKey([name, aadhar]);

		// Fetch request with given name and aadhar of the user. User need to be present to request property registration
		const user = await ctx.userList.getUser(userKey).catch(err => {
			log.error(err);
			throw new Error(`No user found with name ${name} and aadhar ${aadhar}`);
		});

		// Fetch property request from ledger. If already present throw error
		let existingRequest = await ctx.propertyRegistrationRequestList
			.getPropertyRegsitrationRequest(propertyRequestKey)
			.catch(err => log.info("Provided Property registration request is unique!"));
		if (existingRequest !== undefined)
			throw new Error(`A request with propertyId ${propertyId} is already present.`);

		// Create a property request object to be stored in blockchain
		let propertyRequestObject = {
			propertyId,
			price,
			status,
			owner: userKey,
			createdAt: new Date()
		};

		// Check of the property request follows all business rules
		if (!Validators.validateProperyRegistrationRequest(propertyRequestObject))
			throw new Error(
				`Invlalid request. Please verify all the fields of the request are correct`
			);

		// Create a new instance of request model and save it to blockchain
		let newRequestObject = PropertyRegistrationRequest.createInstance(propertyRequestObject);
		await ctx.propertyRegistrationRequestList.addPropertyRegsitrationRequest(newRequestObject);
		return newRequestObject;
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

	/**
	 * Update the property status
	 * @param ctx - The transaction context
	 * @param propertyId - propertyId of property to fetch details
	 * @param name - name of the owner
	 * @param aadhar - aadhar of the owner
	 * @param status - status that should be updated with
	 * @returns {Property} - object of property
	 */
	async updateProperty(ctx, propertyId, name, aadhar, status) {
		const propertyKey = Property.makeKey([propertyId]);
		const userKey = User.makeKey([name, aadhar]);
		// Fetch property with given property id
		const property = await ctx.propertyList.getProperty(propertyKey).catch(err => {
			log.error(err);
			throw new Error(`No Property with id ${propertyId} is found`);
		});
		// verify if the user details passed to this method is the owner of the property
		if (property.owner !== userKey)
			throw new Error(` Owner details doesnot match with the property`);
		// Update the status and validate the property object after update
		let propertyObject = { ...property, status };
		if (!Validators.validatePropertyData(propertyObject))
			throw new Error("Input Property data is invalid");
		// Save the updated property to the ledger
		let updatedProperyObject = Property.createInstance(propertyObject);
		await ctx.propertyList.updateProperty(updatedProperyObject);
		return updatedProperyObject;
	}

	/**
	 * Method to purchase a property which is onSale
	 * @param ctx - The transaction context
	 * @param propertyId - propertyId of property to purchase
	 * @param name - name of the buyer
	 * @param aadhar - aadhar of the buyer
	 * @returns {Property} - object of property
	 */
	async purchaseProperty(ctx, propertyId, name, aadhar) {
		const propertyKey = Property.makeKey([propertyId]);
		const buyerKey = User.makeKey([name, aadhar]);
		// Fetch property with propertyId
		const property = await ctx.propertyList.getProperty(propertyKey).catch(err => {
			log.error(err);
			throw new Error(`No Property with id ${propertyId} is found`);
		});
		// Check if property is for sale
		if (!Utils.isPropertyForSale(property)) throw new Error(`Property is not for sale`);
		// Check if buyer inforamtion is valid
		const buyer = await ctx.userList.getUser(buyerKey).catch(err => {
			log.error(err);
			throw new Error(`No user found with name ${name} and aadhar ${aadhar}`);
		});
		// Fetch owner details
		const seller = await ctx.userList.getUser(property.owner).catch(err => {
			log.error(err);
			throw new Error(`Property data is invalid`);
		});
		// Check if buyer has enough upgradCoins to buy the property
		if (property.price > buyer.upgradCoins)
			throw new Error(`Buyer doesnot have enough upgrad coins`);

		buyer.upgradCoins -= Number(property.price); // Reduce price amount from buyer account balance
		seller.upgradCoins += Number(property.price); // Add price ammount to seller account
		property.owner = buyerKey; // owner is set yo buyer of the house
		property.status = constants.PROPERTY_REGISTERED_STATUS; // Set property status to registered implying not for sale

		let updatedSellerObject = User.createInstance(seller);
		let updatedBuyerObject = User.createInstance(buyer);
		let updatedProperty = Property.createInstance(property);

		// Update the ledger with updated buyer, seller and property objects
		await ctx.userList.updateUser(updatedSellerObject);
		await ctx.userList.updateUser(updatedBuyerObject);
		await ctx.propertyList.updateProperty(updatedProperty);

		return updatedProperty;
	}
}

module.exports = UserContract;

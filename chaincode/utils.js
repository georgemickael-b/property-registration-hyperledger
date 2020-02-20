'use strict';

const constants = require('./constansts');
/**
 * Class with all utility functions
 */
class Utils{
    /**
     * Fetches upgrad coins from bank transaction id
     * @param bankTransationId - transaction id from bank
     */
    static getUpgradCoinsFromBankTransaction(bankTransationId){
        return Number(bankTransationId.replace("upg",""))
    }

    /**
     * Check if the property status is onSale
     * @param {*} property 
     */
    static isPropertyForSale(property){
        return property.status === constants.PROPERTY_ON_SALE_STATUS;
    }
}

module.exports = Utils;
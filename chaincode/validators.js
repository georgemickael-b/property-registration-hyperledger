const constants = require("./constansts")

/**
 * Class containing all validation functions
 */
class Validators { 
    /**
     * Validates if the bank transaction id is in valid format
     * @param transactionId - transaction id from the bank
     */
    static validateBankTransaction(transactionId){
        return ['upg100','upg500','upg1000'].includes(transactionId)
    }

    /**
     * Validate if PropertyRegistrationRequest object is in valid format and had valid status
     * @param  request - Property Registration Request
     */
    static validateProperyRegistrationRequest(request){
        return [constants.PROPERTY_ON_SALE_STATUS,constants.PROPERTY_REGISTERED_STATUS].includes(request.status);
    }

    /**
     * Validate if Propertyt object is in valid format and had valid status
     * @param  request - Property Request
     */
    static validatePropertyData(property){
        return [constants.PROPERTY_ON_SALE_STATUS,constants.PROPERTY_REGISTERED_STATUS].includes(property.status);
    }
}
module.exports = Validators;
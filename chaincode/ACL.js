'use strict';

const REGISTRAR_MSP_ID = "registrarMSP";
const USERS_MSP_ID = "usersMSP"

const PERMISSION_ERROR_MESSAGE = `You do not have persmission to do this operation`

/**
 * Class which contains all ACL related methods
 */
class ACL {
    /**
     * Checks if the peer initiating the transaction is a registrar if not throw error and return
     * @param ctx - transation context
     */
    static allowOnlyRegistrar(ctx) {
       if( ctx.clientIdentity.getMSPID() ===  REGISTRAR_MSP_ID )
            return
        throw new Error(PERMISSION_ERROR_MESSAGE)
    }

    /**
     * Checks if the peer initiating the transaction is a user peer if not throw error and return
     * @param ctx - transation context
     */
    static allowOnlyUsers(ctx) {
        if( ctx.clientIdentity.getMSPID() ===  USERS_MSP_ID )
             return
         throw new Error(PERMISSION_ERROR_MESSAGE)
     }
}

module.exports = ACL